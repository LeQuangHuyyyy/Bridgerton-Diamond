package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;
import org.example.diamondshopsystem.entities.OrderStatus;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class DeliveryOrderDetail {
    private String userName;
    private String email;
    private String phoneNumber;
    private String address;
    private Date orderDate;
    private double totalAmount;

    private int orderId;
    private String image;
    private OrderStatus orderStatus;
    private int totalProductInOrder;

    List<OrderProductDetailRequest> product;
}
