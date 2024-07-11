package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderProductDetailRequest {
    private String productName;
    private int quantity;
    private double price;
    private double size;
    private String warrantiesImage;
    private String certificateImage;
}
