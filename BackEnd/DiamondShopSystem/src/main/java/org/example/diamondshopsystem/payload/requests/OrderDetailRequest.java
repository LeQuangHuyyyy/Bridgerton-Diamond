package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;
import org.example.diamondshopsystem.entities.OrderStatus;

import java.util.Date;
import java.util.List;

// lấy cả name, email, orderDate, totalAmount, product của order detail đó product có tên, số lượng và price

@Getter
@Setter
public class OrderDetailRequest {
    private String userName;
    private String email;
    private String phoneNumber;
    private String address;
    private Date orderDate;
    private double totalAmount;
    private String saleStaff;
    private int saleId;


    private int orderId;
    private String image;
    private OrderStatus orderStatus;
    private int totalProductInOrder;

    List<OrderProductDetailRequest> product;
}
