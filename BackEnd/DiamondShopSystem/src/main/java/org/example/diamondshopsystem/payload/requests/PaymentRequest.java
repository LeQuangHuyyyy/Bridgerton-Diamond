package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    private String bankCode;
    private Integer orderId;
}
