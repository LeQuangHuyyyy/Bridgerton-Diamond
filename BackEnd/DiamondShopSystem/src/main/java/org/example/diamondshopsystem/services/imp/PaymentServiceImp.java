package org.example.diamondshopsystem.services.imp;


import jakarta.servlet.http.HttpServletRequest;
import org.example.diamondshopsystem.dto.PaymentDTO;
import org.example.diamondshopsystem.entities.Payments;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Map;


public interface PaymentServiceImp {

    PaymentDTO.VNPayResponse createVnPayPayment(BigDecimal totalPrice,String bankcode,Integer orderId, HttpServletRequest request);

    void savePayment(PaymentDTO paymentDTO);

    Boolean verifyVNPayCallback(Map<String, String[]> parameterMap);

    PaymentDTO convertRequestToPaymentDTO(Map<String, String[]> parameterMap);

}
