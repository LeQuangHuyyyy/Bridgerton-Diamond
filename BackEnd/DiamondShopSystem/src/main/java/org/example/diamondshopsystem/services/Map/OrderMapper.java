package org.example.diamondshopsystem.services.Map;

import org.example.diamondshopsystem.dto.*;
import org.example.diamondshopsystem.entities.*;
import org.example.diamondshopsystem.entities.Warranties;
import org.example.diamondshopsystem.entities.key.KeyOrderDetail;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public Order mapOrderDTOToOrder(OrderDTO orderDTO, User customer) {
        if (orderDTO == null || customer == null) {
            return null;
        }
        Order order = new Order();
        order.setOrderDate(orderDTO.getOrderDate());
        order.setOrderTotalAmount(orderDTO.getOrderTotalAmount());
        order.setOrderDeliveryAddress(orderDTO.getOrderDeliveryAddress());
        order.setStatus(orderDTO.getStatus());
        order.setCustomer(customer);
        return order;
    }

    public OrderDetails mapOrderDetailDTOToOrderDetail(OrderDetailDTO orderDetailDTO, Order order, Products product) {
        if (orderDetailDTO == null || order == null || product == null) {
            return null;
        }
        OrderDetails orderDetails = new OrderDetails();
        KeyOrderDetail key = new KeyOrderDetail(orderDetailDTO.getOrderId(), orderDetailDTO.getProductId());
        orderDetails.setId(key);
        orderDetails.setOrder(order);
        orderDetails.setProduct(product);
        orderDetails.setQuantity(orderDetailDTO.getQuantity());
        orderDetails.setPrice(orderDetailDTO.getPrice());
        Size size = new Size();
        size.setValueSize(orderDetailDTO.getSize());
        orderDetails.setSize(orderDetailDTO.getSize());
        return orderDetails;
    }

    public OrderDTO mapOrderToOrderDTO(Order order) {
        if (order == null) {
            return null;
        }
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOrderId(order.getOrderId());
        orderDTO.setOrderDate(order.getOrderDate());
        orderDTO.setOrderTotalAmount(order.getOrderTotalAmount());
        orderDTO.setOrderDeliveryAddress(order.getOrderDeliveryAddress());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setDiscountCode(order.getDiscountCode() != null ? order.getDiscountCode().getCode() : null);
        orderDTO.setCustomerId(order.getCustomer().getUserid());
        orderDTO.setSaleId(order.getSale() != null ? order.getSale().getUserid() : 0);
        orderDTO.setDeliveryId(order.getDelivery() != null ? order.getDelivery().getUserid() : 0);
        return orderDTO;
    }

    private OrderDetailDTO mapOrderDetailToOrderDetailDTO(OrderDetails orderDetails) {
        OrderDetailDTO orderDetailDTO = new OrderDetailDTO();
        orderDetailDTO.setOrderId(orderDetails.getOrder().getOrderId());
        orderDetailDTO.setProductId(orderDetails.getProduct().getProductId());
        orderDetailDTO.setQuantity(orderDetails.getQuantity());
        orderDetailDTO.setPrice(orderDetails.getPrice());
        Size size = new Size();
        size.setValueSize(orderDetailDTO.getSize());
        orderDetails.setSize(orderDetailDTO.getSize());
        return orderDetailDTO;
    }

    private FeedBackDTO mapFeedbackToFeedbackDTO(FeedBack feedback) {
        FeedBackDTO feedbackDTO = new FeedBackDTO();
        feedbackDTO.setComment(feedback.getComment());
        feedbackDTO.setRating(feedback.getRating());
        return feedbackDTO;
    }

    private WarrantyDTO mapWarrantyToWarrantyDTO(Warranties warranty) {
        WarrantyDTO warrantyDTO = new WarrantyDTO();
        warrantyDTO.setWarrantiesId(warranty.getWarrantiesId());
        warrantyDTO.setWarrantyStartDate(warranty.getWarrantyStartDate());
        warrantyDTO.setWarrantyExpirationDate(warranty.getWarrantyExpirationDate());
        return warrantyDTO;
    }

    private InvoiceDTO mapInvoiceToInvoiceDTO(Invoice invoice) {
        InvoiceDTO invoiceDTO = new InvoiceDTO();
        invoiceDTO.setInvoiceId(invoice.getInvoiceId());
        invoiceDTO.setInvoiceDate(invoice.getInvoiceDate());
        invoiceDTO.setInvoiceDueDate(invoice.getInvoiceDueDate());
        invoiceDTO.setTotalAmount(invoice.getTotalAmount());
        invoiceDTO.setPaidAmount(invoice.getPaidAmount());
        return invoiceDTO;
    }

    private PaymentDTO mapPaymentToPaymentDTO(Payments payment) {
        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setPaymentsId(payment.getPaymentsId());
        paymentDTO.setPaymentAmount(payment.getPaymentAmount());
        paymentDTO.setPaymentMode(payment.getPaymentMode());
        paymentDTO.setPaymentTime(payment.getPaymentTime());
        paymentDTO.setDescription(payment.getDescription());
        paymentDTO.setPaymentCode(payment.getPaymentCode());
        return paymentDTO;
    }
}
