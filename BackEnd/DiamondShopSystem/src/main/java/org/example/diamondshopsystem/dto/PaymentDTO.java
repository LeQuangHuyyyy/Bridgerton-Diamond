package org.example.diamondshopsystem.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class PaymentDTO {

    private int paymentsId;

    private int paymentAmount;

    private String paymentMode;

    private Date paymentTime;

    private String description;

    private String paymentCode;

    private int orderId;



    @Data
    @Builder
    public static class VNPayResponse {
        public String code;
        public String message;
        public String paymentUrl;

        // Public constructor
        public VNPayResponse(String code, String message, String paymentUrl) {
            this.code = code;
            this.message = message;
            this.paymentUrl = paymentUrl;
        }
    }
}
