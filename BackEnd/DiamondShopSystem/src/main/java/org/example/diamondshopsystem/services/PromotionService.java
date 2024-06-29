package org.example.diamondshopsystem.services;


import org.example.diamondshopsystem.dto.PromotionDTO;
import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.Promotions;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.repositories.PromotionRepository;
import org.example.diamondshopsystem.repositories.UserRepository;
import org.example.diamondshopsystem.services.Map.UserMapper;
import org.example.diamondshopsystem.services.imp.PromotionServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PromotionService implements PromotionServiceImp {

    public final PromotionRepository promotionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    @Override
    public List<PromotionDTO> getAllPromotions() {
        List<Promotions> promotionsList = promotionRepository.findAll();
        List<PromotionDTO> promotionDTOList = new ArrayList<>();
        for (Promotions promotion : promotionsList) {
            PromotionDTO promotionDTO = mapPromotionToDTO(promotion);
            promotionDTOList.add(promotionDTO);
        }
        return promotionDTOList;
    }

    @Override
    public Promotions getPromotionById(int id) {
        Promotions promotions = promotionRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Promotion not found"));
        return promotions;
    }

    @Override
    public PromotionDTO getPromotionDTOById(int id) {
        Promotions promotions = promotionRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Promotion not found"));
        return mapPromotionToDTO(promotions);
    }

    @Override
    public List<PromotionDTO> getPromotionsByName(String name) {

        List<Promotions> promotionsList = promotionRepository.findAllByPromotionName(name);
        List<PromotionDTO> promotionDTOList = new ArrayList<>();
        if (!promotionsList.isEmpty()) {
            for (Promotions promotion : promotionsList) {
                PromotionDTO promotionDTO = mapPromotionToDTO(promotion);
                promotionDTOList.add(promotionDTO);
            }
            return promotionDTOList;
        }
        return Collections.emptyList();
    }

    @Override
    public PromotionDTO createPromotion(PromotionDTO promotionDTO) {
//        User manager = userRepository.findById(promotionDTO.getManagerId()).get();
        Promotions promotions = new Promotions();
        promotions.setPromotionName(promotionDTO.getPromotionName());
        promotions.setPromotionStartDate(promotionDTO.getPromotionStartDate());
        promotions.setPromotionEndDate(promotionDTO.getPromotionEndDate());
//        promotions.setManager(manager);
        Promotions savedPromotion = promotionRepository.save(promotions);
        return mapPromotionToDTO(savedPromotion);
    }

    @Override
    public PromotionDTO updatePromotion(PromotionDTO promotionDTO) {
        Optional<Promotions> promotionsOptional = promotionRepository.findById(promotionDTO.getPromotionId());
        if (promotionsOptional.isPresent()) {
            Promotions promotion = promotionsOptional.get();
            promotion.setPromotionName(promotionDTO.getPromotionName());
            promotion.setPromotionStartDate(promotionDTO.getPromotionStartDate());
            promotion.setPromotionEndDate(promotionDTO.getPromotionEndDate());
            Promotions updatedPromotion = promotionRepository.save(promotion);
            return mapPromotionToDTO(updatedPromotion);
        }
        return null;
    }


    @Override
    public List<PromotionDTO> getPromotionsByDateRange(Date startDate, Date endDate) {
        List<Promotions> promotionsList = promotionRepository.findPromotionsByDateRange(startDate, endDate);
        List<PromotionDTO> promotionDTOList = new ArrayList<>();
        for (Promotions promotion : promotionsList) {
            PromotionDTO promotionDTO = mapPromotionToDTO(promotion);
            promotionDTOList.add(promotionDTO);
        }
        return promotionDTOList;
    }

    @Override
    public List<PromotionDTO> getPromotionByDateRangeAndName(String name, Date sdate, Date edate) {
        List<Promotions> promotionsList = promotionRepository.findPromotionsByDateRangeAndPromotionName(name, sdate, edate);
        List<PromotionDTO> promotionDTOList = new ArrayList<>();
        for (Promotions promotion : promotionsList) {
            PromotionDTO promotionDTO = mapPromotionToDTO(promotion);
            promotionDTOList.add(promotionDTO);
        }
        return promotionDTOList;
    }

    @Override
    public void deletePromotion(int id) {
        promotionRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Promotion not found"));
        promotionRepository.deleteById(id);
    }

    private PromotionDTO mapPromotionToDTO(Promotions promotion) {
        PromotionDTO promotionDTO = new PromotionDTO();
        promotionDTO.setPromotionId(promotion.getPromotionId());
        promotionDTO.setPromotionName(promotion.getPromotionName());
        promotionDTO.setPromotionStartDate(promotion.getPromotionStartDate());
        promotionDTO.setPromotionEndDate(promotion.getPromotionEndDate());
        if (promotion.getManager() != null) {
            promotionDTO.setManagerId(promotion.getManager().getUserid());
        }
        return promotionDTO;
    }


}