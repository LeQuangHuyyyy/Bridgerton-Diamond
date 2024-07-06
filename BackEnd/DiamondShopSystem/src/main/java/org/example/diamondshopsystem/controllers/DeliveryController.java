package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.dto.OrderDTO;
import org.example.diamondshopsystem.entities.OrderStatus;
import org.example.diamondshopsystem.repositories.OrderRepository;
import org.example.diamondshopsystem.services.ShoppingCartService;
import org.example.diamondshopsystem.services.imp.OrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/delivery")
@CrossOrigin(origins = "*")
public class DeliveryController {


    @Autowired
    ShoppingCartService shoppingCartService;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderServiceImp orderServiceImp;


    @GetMapping("/getOrderDelivery")
    public ResponseEntity<List<OrderDTO>> getOrderByDelivery(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        try {
            OrderStatus statuses = OrderStatus.DELIVERED;
            Page<OrderDTO> newOrdersPage = orderServiceImp.getAllOrderByStatus(statuses, PageRequest.of(page, size));
            List<OrderDTO> newOrders = newOrdersPage.getContent();
            return ResponseEntity.ok(newOrders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
