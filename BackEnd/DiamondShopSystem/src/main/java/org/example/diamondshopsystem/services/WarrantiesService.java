package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.DiamondDTO;
import org.example.diamondshopsystem.dto.WarrantyDTO;
import org.example.diamondshopsystem.entities.Diamond;
import org.example.diamondshopsystem.entities.Order;
import org.example.diamondshopsystem.entities.Products;
import org.example.diamondshopsystem.entities.Warranties;
import org.example.diamondshopsystem.repositories.OrderRepository;
import org.example.diamondshopsystem.repositories.ProductRepository;
import org.example.diamondshopsystem.repositories.WarrantiesRepository;
import org.example.diamondshopsystem.services.imp.WarrantiesServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class WarrantiesService implements WarrantiesServiceImp {
    @Autowired
    WarrantiesRepository warrantiesRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    OrderRepository orderRepository;

    @Transactional
    public WarrantyDTO createWarranties(int productId, int orderId) {
        String code = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        code = "W_" + code;

        Products products = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Cannot find product with this id"));
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Cannot find order with this id"));

        Date orderDate = order.getOrderDate();
        int dayToAdd = (int) products.getWarrantiesYear() * 365;
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(orderDate);
        calendar.add(Calendar.DAY_OF_YEAR, dayToAdd);

        Date warrantyExpirationDate = calendar.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDateString = sdf.format(warrantyExpirationDate);

        Date parsedDate;
        try {
            parsedDate = sdf.parse(formattedDateString);
        } catch (ParseException e) {
            throw new RuntimeException("Failed to parse warranty expiration date", e);
        }

        Warranties warranties = new Warranties();
        warranties.setWarrantyCode(code);
        warranties.setWarrantyStartDate(orderDate);
        warranties.setWarrantyExpirationDate(parsedDate);
        warranties.setOrder(order);
        warranties.setProduct(products);

        try {
            warrantiesRepository.saveAndFlush(warranties);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Order setOrder = orderRepository.findById(orderId).get();
        Products setProduct = productRepository.findById(productId).get();
        setOrder.setWarranties(warranties);
        setProduct.setWarranties(List.of(warranties));
        orderRepository.save(setOrder);
        productRepository.save(setProduct);

        WarrantyDTO warrantyDTO = new WarrantyDTO();
        warrantyDTO.setWarrantyCode(code);
        warrantyDTO.setWarrantyStartDate(orderDate);
        warrantyDTO.setWarrantyExpirationDate(parsedDate);
        warrantyDTO.setOrderId(orderId);
        warrantyDTO.setProductId(productId);
        warrantyDTO.setProductName(products.getProductName());

        List<DiamondDTO> diamondDtoList = new ArrayList<>();
        for (Diamond diamond : products.getDiamonds()) {
            DiamondDTO diamondDTO = new DiamondDTO();
            diamondDTO.setDiamondId(diamond.getDiamondId());
            diamondDTO.setCarat(diamond.getCarat());
            diamondDTO.setPrice(diamond.getPrice());
            diamondDTO.setCut(diamond.getCut());
            diamondDTO.setColor(diamond.getColor());
            diamondDTO.setClarity(diamond.getClarity());
            diamondDTO.setCertification(diamond.getCertification());
            diamondDtoList.add(diamondDTO);
        }
        warrantyDTO.setDiamondDto(diamondDtoList);

        return warrantyDTO;
    }
}
