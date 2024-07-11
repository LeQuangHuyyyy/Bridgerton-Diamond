package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.dto.OrderDTO;
import org.example.diamondshopsystem.dto.OrderDetailDTO;
import org.example.diamondshopsystem.entities.OrderStatus;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.payload.requests.OrderDetailRequest;
import org.example.diamondshopsystem.repositories.OrderRepository;
import org.example.diamondshopsystem.services.ShoppingCartService;
import org.example.diamondshopsystem.services.imp.OrderDetailsServiceImp;
import org.example.diamondshopsystem.services.imp.OrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    ShoppingCartService shoppingCartService;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderServiceImp orderServiceImp;

    @Autowired
    OrderDetailsServiceImp orderDetailsService;


    @GetMapping
    public ResponseEntity<Page<OrderDTO>> getAllOrders(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "1000") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<OrderDTO> allOrder = orderServiceImp.getAllOrder(pageable);
            return ResponseEntity.ok(allOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/OrdersData/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable int orderId) {
        OrderDetailRequest orderDetailRequest = orderDetailsService.getOrderDetailSaleStaffById(orderId);
        ResponseData responseData = new ResponseData();

        if (orderDetailRequest != null) {
            responseData.setDescription("Order detail found");
            responseData.setData(orderDetailRequest);
            return ResponseEntity.status(HttpStatus.OK).body(responseData);
        } else {
            responseData.setDescription("Order detail not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseData);
        }
    }

    @GetMapping("/OrderDetailByCustomer/{orderId}")
    public ResponseEntity<?> getOrderDetailsById(@PathVariable int orderId) {
        List<OrderDetailDTO> orderDetailDTOs = orderDetailsService.getOrderDetailsByOrderId(orderId);
        ResponseData responseData = new ResponseData();
        if (!orderDetailDTOs.isEmpty()) {
            responseData.setDescription("Order details found");
            responseData.setData(orderDetailDTOs);
            return ResponseEntity.status(HttpStatus.OK).body(responseData);
        } else {
            responseData.setDescription("Order details not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseData);
        }
    }

    @GetMapping("/OrderDetail")
    public ResponseEntity<?> getOrderDetailSaleStaff() {
        List<OrderDetailRequest> orderDetailRequests = orderDetailsService.getOrderDetailSaleStaff();
        ResponseData responseData = new ResponseData();
        responseData.setData(orderDetailRequests);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/search")
    public ResponseEntity<?> SearchOrderByKeyWord(@RequestParam String keyword) {
        OrderStatus status = null;
        try {
            status = OrderStatus.valueOf(keyword.toUpperCase());
        } catch (IllegalArgumentException ignored) {
        }
        List<OrderDTO> orderDTOList = orderServiceImp.searchByKeyWord(keyword, status);
        ResponseData responseData = new ResponseData();
        if (!orderDTOList.isEmpty()) {
            responseData.setData(orderDTOList);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } else {
            responseData.setDescription("ke ke ke tìm c!!");
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/userOrder")
    public ResponseEntity<?> getOrderDetailByUser(@RequestParam int userId) {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.getOrderByUserId(userId));
        responseData.setDescription("này là lấy order thôi nha, ko dc thì chắc là sai á");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

}
