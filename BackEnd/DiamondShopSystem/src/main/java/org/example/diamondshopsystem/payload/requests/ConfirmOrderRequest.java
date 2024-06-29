package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;
import org.example.diamondshopsystem.dto.OrderDTO;
import org.example.diamondshopsystem.dto.PaymentDTO;
import org.example.diamondshopsystem.dto.SizeDTO;

@Getter
@Setter
public class ConfirmOrderRequest {
    private OrderDTO orderDTO;
    private PaymentDTO paymentDTO;

}
