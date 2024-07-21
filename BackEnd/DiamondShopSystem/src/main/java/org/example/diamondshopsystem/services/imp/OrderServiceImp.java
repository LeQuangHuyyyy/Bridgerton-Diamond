package org.example.diamondshopsystem.services.imp;

import jakarta.mail.MessagingException;
import org.example.diamondshopsystem.dto.OrderDTO;
import org.example.diamondshopsystem.dto.PaymentDTO;
import org.example.diamondshopsystem.entities.Order;
import org.example.diamondshopsystem.entities.OrderDetails;
import org.example.diamondshopsystem.entities.OrderStatus;
import org.example.diamondshopsystem.payload.requests.AddProductRequest;
import org.example.diamondshopsystem.payload.requests.DiamondCategory;
import org.example.diamondshopsystem.payload.requests.OrderProductDetailRequest;
import org.example.diamondshopsystem.payload.requests.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public interface OrderServiceImp {
    OrderDTO getOrderById(int orderId);

    boolean setOrderStatusCancel(int orderId);

    BigDecimal findPriceByOrderId(Integer orderId);

    void setOrderStatus(Integer orderId);

    OrderStatus getOrderStatus(Integer orderId);

    Page<OrderDTO> getAllOrder(Pageable pageable);

    Page<OrderDTO> getAllOrderByStatus(OrderStatus status, Pageable pageable);

    Page<OrderDTO> getAllOrdersByStatuses(List<OrderStatus> statuses, Pageable pageable);

    void setOrderFromPaymentToDelivery(Integer orderId, String email);

    List<OrderDTO> searchByKeyWord(String keyword, OrderStatus status);

    List<OrderDTO> getOrderSoldInLastWeek();

    List<OrderProductDetailRequest> getTotalProductInLastWeek();

    double revenueLastWeek();

    List<DiamondCategory> diamondSoldByCategory();

    List<ProductCategory> getProductSoldByCategory();

    double getProfit();

    List<OrderDTO> getOrderByUserId(int userId);

    List<OrderDetails> getDetailByOrderId(int orderId);

    boolean setOrderFromDeliveryToReceived(int orderId, String email) throws MessagingException;


}
