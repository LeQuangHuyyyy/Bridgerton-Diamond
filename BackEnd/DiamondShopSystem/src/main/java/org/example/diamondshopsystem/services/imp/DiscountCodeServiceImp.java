package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.DiscountCodesDTO;

import java.util.List;

public interface DiscountCodeServiceImp {
    List<DiscountCodesDTO> getAllDiscountCodes();
    DiscountCodesDTO getDiscountCodeById(int id);
    List<DiscountCodesDTO> getDiscountCodeByPromotionId(int promotionId);
    List<DiscountCodesDTO> getDiscountCodesByCode(String code);
    DiscountCodesDTO createDiscountCode(DiscountCodesDTO discountCodeDTO);
    DiscountCodesDTO updateDiscountCode(DiscountCodesDTO discountCodeDTO);
    DiscountCodesDTO deleteDiscountCode(int id);

    double getDiscountCodePercentage(String code);
    double useDiscountCode(String code);
}