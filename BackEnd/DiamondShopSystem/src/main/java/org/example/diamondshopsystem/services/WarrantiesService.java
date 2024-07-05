package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.entities.Order;
import org.example.diamondshopsystem.entities.Products;
import org.example.diamondshopsystem.entities.Warranties;
import org.example.diamondshopsystem.repositories.OrderRepository;
import org.example.diamondshopsystem.repositories.ProductRepository;
import org.example.diamondshopsystem.repositories.WarrantiesRepository;
import org.example.diamondshopsystem.services.imp.WarrantiesServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;

@Service
public class WarrantiesService implements WarrantiesServiceImp {
    @Autowired
    private WarrantiesRepository warrantiesRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    public void createWarranties(int productId, int orderId) {
        Products products = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Cannot find product with this id"));
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Cannot find Order with this Id"));
        Warranties warranties = new Warranties();

        Date exdate = order.getOrderDate();
        int daysToAdd = (int) (products.getWarrantiesYear() * 365.25);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(exdate);
        calendar.add(Calendar.DAY_OF_YEAR, daysToAdd);

        warranties.setWarrantyExpirationDate(exdate);
        warranties.setWarrantyStartDate(order.getOrderDate());
        warranties.setOrder(order);
        warranties.setProduct(products);
        warrantiesRepository.save(warranties);
    }
}
