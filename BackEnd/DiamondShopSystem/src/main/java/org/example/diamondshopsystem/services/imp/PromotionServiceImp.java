package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.PromotionDTO;
import org.example.diamondshopsystem.entities.Promotions;
import org.example.diamondshopsystem.payload.requests.DiscountCodeRequest;

import java.util.Date;
import java.util.List;

public interface PromotionServiceImp {
    List<DiscountCodeRequest> getAllPromotions();

    Promotions getPromotionById(int id);

    PromotionDTO getPromotionDTOById(int id);

    PromotionDTO createPromotion(DiscountCodeRequest discountCodeRequest, String authHeader);

    PromotionDTO updatePromotion(DiscountCodeRequest discountCodeRequest);

    List<PromotionDTO> getPromotionsByDateRange(Date startDate, Date endDate);

    List<PromotionDTO> getPromotionsByName(String name);

    List<PromotionDTO> getPromotionByDateRangeAndName(String name, Date sdate, Date edate);

    void deletePromotion();
}