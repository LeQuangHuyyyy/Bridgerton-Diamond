package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.OrderDetailDTO;

import java.util.List;

public interface OrderDetailsServiceImp {
    List<OrderDetailDTO> getOrderDetailsByOrderId(int orderId);
}
