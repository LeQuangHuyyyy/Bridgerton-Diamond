package org.example.diamondshopsystem.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.diamondshopsystem.dto.OrderDTO;
import org.example.diamondshopsystem.dto.PaymentDTO;
import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.OrderStatus;
import org.example.diamondshopsystem.entities.Payments;
import org.example.diamondshopsystem.payload.ResponseObject;
import org.example.diamondshopsystem.payload.requests.PaymentRequest;
import org.example.diamondshopsystem.services.OrderService;
import org.example.diamondshopsystem.services.PaymentService;
import org.example.diamondshopsystem.services.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PaymentController {

    @Autowired
    PaymentService paymentService;

    @Autowired
    ShoppingCartService shoppingCartService;

    @Autowired
    OrderService orderService;

    @PostMapping
    public ResponseEntity<?> payment(@RequestBody PaymentRequest paymentRequest, HttpServletRequest request) {
        String bankCode = paymentRequest.getBankCode();
        if (bankCode == null || bankCode.isEmpty()) {
            return ResponseEntity.badRequest().body("Bank code is required.");
        }
        Integer orderId = paymentRequest.getOrderId();
        BigDecimal totalPrice = orderService.findPriceByOrderId(orderId);
        PaymentDTO.VNPayResponse vnPayResponse = paymentService.createVnPayPayment(totalPrice, bankCode, paymentRequest.getOrderId(), request);
        return ResponseEntity.ok(vnPayResponse);
    }

    @GetMapping("/VNPayBack")
    public ResponseEntity<?> payCallbackHandler(HttpServletRequest request) {
        try {
            String responseCode = request.getParameter("vnp_ResponseCode");
            String redirectUrl;

            if ("00".equals(responseCode)) {
                Map<String, String[]> parameterMap = request.getParameterMap();
                boolean isValid = paymentService.verifyVNPayCallback(parameterMap);

                if (isValid) {
                    PaymentDTO paymentDTO = paymentService.convertRequestToPaymentDTO(parameterMap);

                    String orderInfo = parameterMap.get("vnp_OrderInfo")[0];
                    int orderId = Integer.parseInt(orderInfo.split("Order ID: ")[1]);

                    OrderStatus currentStatus = orderService.getOrderStatus(orderId);
                    if (!OrderStatus.PAYMENT.equals(currentStatus)) {
                        orderService.setOrderStatus(orderId);
                    }
                    paymentService.savePayment(paymentDTO);

                    redirectUrl = "http://localhost:3000/order-success";
                } else {
                    redirectUrl = "http://localhost:3000/payment/result?vnp_ResponseCode=01";
                }
            } else {
                redirectUrl = "http://localhost:3000/payment/result?vnp_ResponseCode=" + responseCode;
            }
            return ResponseEntity.status(HttpStatus.FOUND).header("Location", redirectUrl).build();
        } catch (Exception e) {
            String errorUrl = "http://localhost:3000/payment/result?vnp_ResponseCode=02&message=" + e.getMessage();
            return ResponseEntity.status(HttpStatus.FOUND).header("Location", errorUrl).build();
        }
    }
}
