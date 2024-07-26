package org.example.diamondshopsystem.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.diamondshopsystem.dto.PaymentDTO;
import org.example.diamondshopsystem.entities.DiscountCodes;
import org.example.diamondshopsystem.entities.Order;
import org.example.diamondshopsystem.entities.OrderStatus;
import org.example.diamondshopsystem.payload.requests.PaymentRequest;
import org.example.diamondshopsystem.repositories.DiscountCodeRepository;
import org.example.diamondshopsystem.repositories.OrderRepository;
import org.example.diamondshopsystem.services.OrderService;
import org.example.diamondshopsystem.services.PaymentService;
import org.example.diamondshopsystem.services.ShoppingCartService;
import org.example.diamondshopsystem.services.imp.ProductServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    ProductServiceImp productServiceImp;
    @Autowired
    private DiscountCodeRepository discountCodeRepository;
    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<?> payment(@RequestBody PaymentRequest paymentRequest, HttpServletRequest request) {
        String bankCode = paymentRequest.getBankCode();
        if (bankCode == null || bankCode.isEmpty()) {
            return ResponseEntity.badRequest().body("Bank code is required.");
        }

        Integer orderId = paymentRequest.getOrderId();
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("cannot find order"));
        if (order.getDiscountCode() != null) {
            DiscountCodes d = order.getDiscountCode();
            DiscountCodes setDiscountCode = discountCodeRepository.findById(d.getCodeId()).orElseThrow(() -> new IllegalArgumentException("đ có discount"));
            setDiscountCode.setCodeQuantity(setDiscountCode.getCodeQuantity() - 1);
            discountCodeRepository.save(setDiscountCode);

            double price = shoppingCartService.totalPriceWithDiscountCode(setDiscountCode.getCode(), order.getOrderTotalAmount());
            order.setOrderTotalAmount(price);
            orderRepository.save(order);
        }
//////////////////////////////////////////////////  dag suy nghĩ xem thanh toán xong mới trừ tiền hay pendding thì trừ sao cho đúng logic
        productServiceImp.updateQuantityPay(orderId);

        BigDecimal totalPrice = orderService.findPriceByOrderId(orderId);
        PaymentDTO.VNPayResponse vnPayResponse = paymentService.createVnPayPayment(totalPrice, bankCode, paymentRequest.getOrderId(), request);
        return ResponseEntity.ok(vnPayResponse);
    }

    @GetMapping("/VNPayBack")
    public ResponseEntity<?> payCallbackHandler(HttpServletRequest request) {
        try {
            String responseCode = request.getParameter("vnp_ResponseCode");
            String redirectUrl;

            if (responseCode.equals("00")) {
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

                    redirectUrl = "http://localhost:3000/ordersuccess";

//                    redirectUrl = "https://bridgerton.vercel.app/ordersuccess";
                } else {
//                    redirectUrl = "https://bridgerton.vercel.app/ordersuccess";
                    redirectUrl = "http://localhost:3000/ordersuccess";
                }
            } else {
                redirectUrl = "http://localhost:3000/payment/result?vnp_ResponseCode=" + responseCode;
            }
            return ResponseEntity.status(HttpStatus.FOUND).header("Location", redirectUrl).build();
        } catch (Exception e) {
            String errorUrl = "http://localhost:3000/ordersuccess";
            System.out.println("lỗi");
            return ResponseEntity.status(HttpStatus.FOUND).header("Location", errorUrl).build();
        }
    }

    @PostMapping("refund")
    public ResponseEntity<?> refundPayment(@RequestBody PaymentRequest paymentRequest, HttpServletRequest request) {
        try {
            PaymentDTO.VNPayResponse vnPayResponse = paymentService.refundPayment(paymentRequest, request);
            return ResponseEntity.ok(vnPayResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the refund");
        }
    }
}
