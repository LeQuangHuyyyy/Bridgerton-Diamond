package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.WarrantyDTO;

public interface WarrantiesServiceImp {

    WarrantyDTO createWarranties(int productId, int orderId);

}
