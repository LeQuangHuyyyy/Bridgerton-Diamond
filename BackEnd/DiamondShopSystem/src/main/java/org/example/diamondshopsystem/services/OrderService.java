package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.OrderDTO;
import org.example.diamondshopsystem.dto.PaymentDTO;
import org.example.diamondshopsystem.entities.Order;

import org.example.diamondshopsystem.entities.OrderStatus;
import org.example.diamondshopsystem.entities.Products;
import org.example.diamondshopsystem.payload.requests.AddProductRequest;
import org.example.diamondshopsystem.repositories.OrderDetailRepository;
import org.example.diamondshopsystem.repositories.OrderRepository;
import org.example.diamondshopsystem.repositories.ProductRepository;
import org.example.diamondshopsystem.services.Map.OrderMapper;
import org.example.diamondshopsystem.services.imp.OrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class OrderService implements OrderServiceImp {


    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderMapper orderMapper;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    ProductRepository productRepository;

    @Override
    public Page<OrderDTO> getAllOrder(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findAll(pageable);
        List<OrderDTO> orderDTOList = orderPage.getContent().stream().map(orderMapper::mapOrderToOrderDTO).collect(Collectors.toList());
        return new PageImpl<>(orderDTOList, pageable, orderPage.getTotalElements());
    }


    @Override
    public OrderDTO getOrderById(int orderId) {
        Optional<Order> Order = orderRepository.findById(orderId);
        if (Order.isPresent()) {
            Order order = Order.get();
            return orderMapper.mapOrderToOrderDTO(order);
        }
        return null;
    }

    public BigDecimal findPriceByOrderId(Integer orderId) {
        BigDecimal totalPrice = orderRepository.findTotalPriceByOrderId(orderId);
        return totalPrice;
    }


    //set này danh cho sau khi payment thành oong
    @Override
    public void setOrderStatus(Integer orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if (isStatusTransitionAllowed(order.getStatus(), OrderStatus.PAYMENT)) {
            order.setStatus(OrderStatus.PAYMENT);
            try {
                orderRepository.save(order);
            } catch (DataIntegrityViolationException e) {
                throw new IllegalStateException("Cannot update order status. The new status is not allowed.", e);
            }
        } else {
            throw new IllegalStateException("Status transition from " + order.getStatus() + " to " + OrderStatus.PAYMENT + " is not allowed.");
        }
    }

    @Override
    public OrderStatus getOrderStatus(Integer orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        return order.getStatus();
    }

    @Override
    public Page<OrderDTO> getAllOrderByStatus(OrderStatus status, Pageable pageable) {
        try {
            Page<Order> orderPage = orderRepository.findByStatus(status, pageable);
            List<OrderDTO> orderDTOList = orderPage.getContent().stream().map(orderMapper::mapOrderToOrderDTO).collect(Collectors.toList());
            return new PageImpl<>(orderDTOList, pageable, orderPage.getTotalElements());
        } catch (Exception e) {
            e.getStackTrace();
            throw new RuntimeException("Failed to fetch orders by status");
        }
    }


    @Override
    public Page<OrderDTO> getAllOrdersByStatuses(List<OrderStatus> statuses, Pageable pageable) {
        try {
            Page<Order> orderPage = orderRepository.findByStatuses(statuses, pageable);
            List<OrderDTO> orderDTOList = orderPage.getContent().stream().map(orderMapper::mapOrderToOrderDTO).collect(Collectors.toList());
            return new PageImpl<>(orderDTOList, pageable, orderPage.getTotalElements());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch orders by statuses");
        }
    }

    @Override
    public void setOrderFromPaymentToDelivery(Integer orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if (isStatusTransitionAllowed(order.getStatus(), OrderStatus.PAYMENT)) {
            order.setStatus(OrderStatus.DELIVERED);
            try {
                orderRepository.save(order);
            } catch (DataIntegrityViolationException e) {
                throw new IllegalStateException("Cannot update order status. The new status is not allowed.", e);
            }
        } else {
            throw new IllegalStateException("Status transition from " + order.getStatus() + " to " + OrderStatus.DELIVERED + " is not allowed.");
        }
    }


    private boolean isStatusTransitionAllowed(OrderStatus currentStatus, OrderStatus newStatus) {
        switch (currentStatus) {
            case PENDING:
                return newStatus == OrderStatus.PAYMENT || newStatus == OrderStatus.CANCELED;
            case PAYMENT:
                return newStatus == OrderStatus.DELIVERED || newStatus == OrderStatus.CANCELED;
            case DELIVERED:
                return newStatus == OrderStatus.RECEIVED || newStatus == OrderStatus.CANCELED;
            case CANCELED:
                return false;
            case RECEIVED:
                return false;
            default:
                return false;
        }
    }
}