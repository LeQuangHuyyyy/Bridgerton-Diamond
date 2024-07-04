package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

// lấy cả name, email, orderDate, totalAmount, product của order detail đó product có tên, số lượng và price

@Getter
@Setter
public class OrderDetailRequest {
    private String userName;
    private String email;
    private Date orderDate;
    private double totalAmount;


    List<OrderProductDetailRequest> product;
}
