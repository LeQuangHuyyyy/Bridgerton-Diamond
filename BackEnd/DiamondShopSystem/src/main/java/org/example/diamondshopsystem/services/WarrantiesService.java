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

import java.util.*;

@Service
public class WarrantiesService implements WarrantiesServiceImp {
    @Autowired
    private WarrantiesRepository warrantiesRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    public WarrantyDTO createWarranties(int productId, int orderId) {
        String code = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        code = "W_" + code;

        Products products = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Cannot find product with this id"));
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Cannot find order with this id"));

        Date orderDate = order.getOrderDate();
        int daysToAdd = (int) (products.getWarrantiesYear() * 365.25);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(orderDate);
        calendar.add(Calendar.DAY_OF_YEAR, daysToAdd);
        Date warrantyExpirationDate = calendar.getTime();

        Warranties warranties = new Warranties();

        warranties.setWarrantyCode(code);
        warranties.setWarrantyStartDate(orderDate);
        warranties.setWarrantyExpirationDate(warrantyExpirationDate);
        warranties.setOrder(order);
        warranties.setProduct(products);
        try {
            warrantiesRepository.saveAndFlush(warranties);
        } catch (Exception ignored) {

        }

        WarrantyDTO warrantyDTO = new WarrantyDTO();
        warrantyDTO.setWarrantyId(warranties.getWarrantiesId());
        warrantyDTO.setWarrantyCode(code);
        warrantyDTO.setWarrantyStartDate(orderDate);
        warrantyDTO.setWarrantyExpirationDate(warrantyExpirationDate);
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
