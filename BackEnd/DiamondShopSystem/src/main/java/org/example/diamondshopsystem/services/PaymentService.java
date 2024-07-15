package org.example.diamondshopsystem.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.diamondshopsystem.Security.Config.VNPAYConfig;
import org.example.diamondshopsystem.dto.PaymentDTO;
import org.example.diamondshopsystem.entities.Order;
import org.example.diamondshopsystem.entities.Payments;
import org.example.diamondshopsystem.repositories.OrderRepository;
import org.example.diamondshopsystem.repositories.PaymentRepository;
import org.example.diamondshopsystem.services.imp.PaymentServiceImp;
import org.example.diamondshopsystem.utils.VNPayUtil;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService implements PaymentServiceImp {

    @Autowired
    VNPAYConfig vnpayConfig;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    OrderRepository orderRepository;

    @PersistenceContext
    private EntityManager entityManager;



    @Override
    public PaymentDTO.VNPayResponse createVnPayPayment(BigDecimal totalPrice, String bankCode, Integer orderId, HttpServletRequest request) {
        long amount = totalPrice.multiply(BigDecimal.valueOf(100)).longValue();
        Map<String, String> map = vnpayConfig.getVNPayConfig();
        map.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            map.put("vnp_BankCode", bankCode);
        }
        map.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        map.put("vnp_OrderInfo", "Order ID: " + orderId);

        String queryUrl = VNPayUtil.getPaymentURL(map, true);
        String hashData = VNPayUtil.getPaymentURL(map, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnpayConfig.getSecretKey(), hashData);

        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnpayConfig.getVnp_PayUrl() + "?" + queryUrl;
        return PaymentDTO.VNPayResponse.builder().code("ok").message("success")
                .paymentUrl(paymentUrl).build();
    }

    @Override
    @Transactional
    public void savePayment(PaymentDTO paymentDTO) {
        Payments payment = new Payments();
        payment.setPaymentAmount(paymentDTO.getPaymentAmount());
        payment.setPaymentMode(paymentDTO.getPaymentMode());
        payment.setDescription(paymentDTO.getDescription());
        payment.setPaymentCode(paymentDTO.getPaymentCode());
        payment.setPaymentTime(paymentDTO.getPaymentTime());

        // Retrieve the order from the database using orderId
        Order order = orderRepository.findById(paymentDTO.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order does not exist in the database."));
        // Ensure order is managed by the entity manager
        order = entityManager.merge(order);

        payment.setOrder(order);

        // Save the payment
        paymentRepository.save(payment);
    }

    @Override
    public Boolean verifyVNPayCallback(Map<String, String[]> parameterMap) {
        // Extract necessary parameters from the callback request
        Map<String, String> params = parameterMap.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue()[0]));

        String vnpSecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");

        String hashData = VNPayUtil.getPaymentURL(params, false);
        String calculatedHash = VNPayUtil.hmacSHA512(vnpayConfig.getSecretKey(), hashData);

        return vnpSecureHash.equals(calculatedHash);
    }

    @Override
    public PaymentDTO convertRequestToPaymentDTO(Map<String, String[]> parameterMap) {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setPaymentAmount(Integer.parseInt(parameterMap.get("vnp_Amount")[0]));
        paymentDTO.setPaymentMode(parameterMap.get("vnp_CardType")[0]);
        paymentDTO.setDescription("Payment description");
        paymentDTO.setPaymentCode(parameterMap.get("vnp_TransactionNo")[0]);
        paymentDTO.setPaymentTime(new Date());
        paymentDTO.setOrderId(Integer.parseInt(parameterMap.get("vnp_OrderInfo")[0].split("Order ID: ")[1]));
        return paymentDTO;
    }
}
