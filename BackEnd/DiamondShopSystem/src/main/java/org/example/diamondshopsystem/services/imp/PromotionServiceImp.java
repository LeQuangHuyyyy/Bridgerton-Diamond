package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.PromotionDTO;
import org.example.diamondshopsystem.entities.Promotions;

import java.util.Date;
import java.util.List;

public interface PromotionServiceImp {
    List<PromotionDTO> getAllPromotions();

    Promotions getPromotionById(int id);

    PromotionDTO getPromotionDTOById(int id);

    PromotionDTO createPromotion(PromotionDTO promotionDTO );

    PromotionDTO updatePromotion(PromotionDTO promotionDTO);

    List<PromotionDTO> getPromotionsByDateRange(Date startDate, Date endDate);

    List<PromotionDTO> getPromotionsByName(String name);

    List<PromotionDTO> getPromotionByDateRangeAndName(String name, Date sdate, Date edate);

    void deletePromotion(int id);
}