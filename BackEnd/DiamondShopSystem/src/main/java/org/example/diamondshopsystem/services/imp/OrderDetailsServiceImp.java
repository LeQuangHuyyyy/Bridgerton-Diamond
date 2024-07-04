package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.OrderDetailDTO;
import org.example.diamondshopsystem.payload.requests.OrderDetailRequest;

import java.util.List;

public interface OrderDetailsServiceImp {
    List<OrderDetailDTO> getOrderDetailsByOrderId(int orderId);

    List<OrderDetailRequest> getOrderDetailSaleStaff();
}
