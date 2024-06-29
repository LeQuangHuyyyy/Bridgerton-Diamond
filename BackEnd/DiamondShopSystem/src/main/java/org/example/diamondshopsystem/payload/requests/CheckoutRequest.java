package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutRequest {
    private String deliveryAddress;
    private String code;
}
