package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequest {
    private int userId;
    private double amount;
    private String addressOrder;
    private String discountCode;
    List<AddProductRequest> addProductRequestList;
}
