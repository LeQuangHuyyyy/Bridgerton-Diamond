package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.OrderDetailDTO;
import org.example.diamondshopsystem.payload.requests.OrderDetailRequest;

import java.util.List;

public interface OrderDetailsServiceImp {
    List<OrderDetailDTO> getOrderDetailsByOrderId(int orderId);

    List<OrderDetailRequest> getOrderDetailSaleStaff();
<<<<<<< HEAD
=======

>>>>>>> 7ab69e206c4a324aa9194fad98ffb4e1810a0b43
    OrderDetailRequest getOrderDetailSaleStaffById(int orderId);
}
