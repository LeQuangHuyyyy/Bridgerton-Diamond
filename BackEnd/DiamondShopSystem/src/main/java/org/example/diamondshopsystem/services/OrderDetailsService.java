package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.OrderDetailDTO;
import org.example.diamondshopsystem.entities.Order;
import org.example.diamondshopsystem.entities.OrderDetails;
import org.example.diamondshopsystem.entities.Products;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.payload.requests.OrderDetailRequest;
import org.example.diamondshopsystem.payload.requests.OrderProductDetailRequest;
import org.example.diamondshopsystem.repositories.OrderDetailRepository;
import org.example.diamondshopsystem.repositories.OrderRepository;
import org.example.diamondshopsystem.repositories.ProductRepository;
import org.example.diamondshopsystem.repositories.UserRepository;
import org.example.diamondshopsystem.services.imp.OrderDetailsServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderDetailsService implements OrderDetailsServiceImp {

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<OrderDetailDTO> getOrderDetailsByOrderId(int orderId) {
        List<OrderDetails> orderDetails = orderDetailRepository.findByOrderId(orderId);
        return orderDetails.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private OrderDetailDTO mapToDTO(OrderDetails orderDetails) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrderId(orderDetails.getOrder().getOrderId());
        dto.setProductId(orderDetails.getProduct().getProductId());
        dto.setQuantity(orderDetails.getQuantity());
        dto.setPrice(orderDetails.getPrice());
        dto.setSize(orderDetails.getSize());
        return dto;
    }

    private static OrderProductDetailRequest getOrderProductDetailRequest(OrderDetails od) {
        OrderProductDetailRequest orderProductDetailRequests = new OrderProductDetailRequest();

        Products products = od.getProduct();
        String productName = products.getProductName();
        double price = products.getPrice();
        int quantity = od.getQuantity();
        orderProductDetailRequests.setCertificateImage(products.getImageCertificate());
        orderProductDetailRequests.setWarrantiesImage(products.getImageWarranties());
        orderProductDetailRequests.setImage(products.getImage1());
        orderProductDetailRequests.setProductName(productName);
        orderProductDetailRequests.setQuantity(quantity);
        orderProductDetailRequests.setPrice(price);
        orderProductDetailRequests.setSize(od.getSize());

        return orderProductDetailRequests;
    }

    @Override
    public OrderDetailRequest getOrderDetailSaleStaffById(int orderId) {
        Order orders = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Cannot find Order"));

        OrderDetailRequest orderDetailRequest = new OrderDetailRequest();

        List<OrderProductDetailRequest> list = new ArrayList<>();
        User user = orders.getCustomer();
        String username = user.getName();
        String mail = user.getEmail();
        String phoneNumber = user.getPhoneNumber();
        String address = orders.getOrderDeliveryAddress();

        OrderProductDetailRequest orderProductDetailRequests = new OrderProductDetailRequest();
        for (OrderDetails od : orders.getOrderDetails()) {
            orderProductDetailRequests = getOrderProductDetailRequest(od);
            list.add(orderProductDetailRequests);
        }

        orderDetailRequest.setUserName(username);
        orderDetailRequest.setEmail(mail);
        orderDetailRequest.setPhoneNumber(phoneNumber);
        orderDetailRequest.setAddress(address);

        if (orders.getDiscountCode() != null) {
            orderDetailRequest.setPercent(orders.getDiscountCode().getDiscountPercentTage());
        }
        if (orders.getSale() != null) {
            orderDetailRequest.setSaleStaff(orders.getSale().getName());
            orderDetailRequest.setSaleId(orders.getSale().getUserid());
        }
        if (orders.getSale() != null) {
            orderDetailRequest.setSaleStaff(orders.getSale().getName());
        }

        orderDetailRequest.setOrderDate(orders.getOrderDate());
        orderDetailRequest.setTotalAmount(orders.getOrderTotalAmount());

        orderDetailRequest.setOrderId(orderId);
        orderDetailRequest.setOrderStatus(orders.getStatus());
        orderDetailRequest.setTotalProductInOrder(list.size());

        orderDetailRequest.setProduct(list);

        return orderDetailRequest;
    }

    @Override
    public List<OrderDetailRequest> getOrderDetailSaleStaff() {

        List<Order> orders = orderRepository.findAll();

        List<OrderDetailRequest> orderDetailList = new ArrayList<>();

        for (Order o : orders) {
            OrderDetailRequest orderDetailRequest = new OrderDetailRequest();
            List<OrderProductDetailRequest> list = new ArrayList<>();

            User user = o.getCustomer();
            String username = user.getName();
            String mail = user.getEmail();


            for (OrderDetails od : o.getOrderDetails()) {
                OrderProductDetailRequest orderProductDetailRequests = getOrderProductDetailRequest(od);
                list.add(orderProductDetailRequests);
            }
            orderDetailRequest.setUserName(username);
            orderDetailRequest.setEmail(mail);
            orderDetailRequest.setOrderDate(o.getOrderDate());
            orderDetailRequest.setTotalAmount(o.getOrderTotalAmount());

            orderDetailRequest.setProduct(list);

            if (!o.getOrderDetails().isEmpty()) {
                orderDetailList.add(orderDetailRequest);
            }
        }

        return orderDetailList;
    }


}














