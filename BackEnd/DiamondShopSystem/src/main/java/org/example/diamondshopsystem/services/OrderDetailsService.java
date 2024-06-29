package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.OrderDetailDTO;
import org.example.diamondshopsystem.entities.OrderDetails;
import org.example.diamondshopsystem.repositories.OrderDetailRepository;
import org.example.diamondshopsystem.services.imp.OrderDetailsServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderDetailsService implements OrderDetailsServiceImp {

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Override
    public List<OrderDetailDTO> getOrderDetailsByOrderId(int orderId) {
        List<OrderDetails> orderDetails = orderDetailRepository.findByOrderId(orderId);
        return orderDetails.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    private OrderDetailDTO mapToDTO(OrderDetails orderDetails) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrderId(orderDetails.getOrder().getOrderId());
        dto.setProductId(orderDetails.getProduct().getProductId());
        dto.setQuantity(orderDetails.getQuantity());
        dto.setPrice(orderDetails.getPrice());
        dto.setSize(orderDetails.getSize());
        return dto;
    }
}
