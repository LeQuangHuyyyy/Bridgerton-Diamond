package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.OrderDTO;
import org.example.diamondshopsystem.dto.PaymentDTO;
import org.example.diamondshopsystem.entities.Order;
import org.example.diamondshopsystem.entities.OrderStatus;
import org.example.diamondshopsystem.payload.requests.AddProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public interface OrderServiceImp {
    OrderDTO getOrderById(int orderId);

    BigDecimal findPriceByOrderId(Integer orderId);

    void setOrderStatus(Integer orderId);

    OrderStatus getOrderStatus(Integer orderId);

    Page<OrderDTO> getAllOrder(Pageable pageable);

    Page<OrderDTO> getAllOrderByStatus(OrderStatus status, Pageable pageable);

    Page<OrderDTO> getAllOrdersByStatuses(List<OrderStatus> statuses, Pageable pageable);

    void setOrderFromPaymentToDelivery(Integer orderId);

}
