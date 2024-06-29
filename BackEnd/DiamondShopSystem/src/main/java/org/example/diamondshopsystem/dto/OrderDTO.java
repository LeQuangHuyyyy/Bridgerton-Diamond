package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.diamondshopsystem.entities.OrderStatus;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class OrderDTO {

    private int orderId;

    private Date orderDate;

    private double orderTotalAmount;

    private String orderDeliveryAddress;

    private OrderStatus status;

    private String discountCode;

    private int customerId;
    private int saleId;
    private int deliveryId;

    private List<OrderDetailDTO> orderDetails;
    private List<FeedBackDTO> feedbacks;
    private List<WarrantyDTO> warranties;
    private List<InvoiceDTO> invoices;
    private List<PaymentDTO> payments;


}
