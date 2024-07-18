package org.example.diamondshopsystem.services;


import org.example.diamondshopsystem.dto.PromotionDTO;
import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.DiscountCodes;
import org.example.diamondshopsystem.entities.Order;
import org.example.diamondshopsystem.entities.Promotions;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.payload.requests.DiscountCodeRequest;
import org.example.diamondshopsystem.repositories.DiscountCodeRepository;
import org.example.diamondshopsystem.repositories.OrderRepository;
import org.example.diamondshopsystem.repositories.PromotionRepository;
import org.example.diamondshopsystem.repositories.UserRepository;
import org.example.diamondshopsystem.services.Map.UserMapper;
import org.example.diamondshopsystem.services.imp.PromotionServiceImp;
import org.example.diamondshopsystem.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PromotionService implements PromotionServiceImp {

    public final PromotionRepository promotionRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DiscountCodeRepository discountCodeRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserService userService;
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    @Override
    public List<DiscountCodeRequest> getAllPromotions() {
        List<Promotions> promotionsList = promotionRepository.findAll();
        List<DiscountCodeRequest> discountCodeList = new ArrayList<>();
        for (Promotions p : promotionsList) {
            DiscountCodeRequest discountCodeRequest = new DiscountCodeRequest();
            discountCodeRequest.setId(p.getPromotionId());
            discountCodeRequest.setName(p.getPromotionName());
            discountCodeRequest.setStartDate(p.getPromotionStartDate());
            discountCodeRequest.setEndDate(p.getPromotionEndDate());
            if (p.getManager() != null) {
                discountCodeRequest.setManagerId(p.getManager().getUserid());
            }
            for (DiscountCodes d : p.getDiscountCodes()) {
                discountCodeRequest.setCode(d.getCode());
                discountCodeRequest.setDiscountPercent(d.getDiscountPercentTage());
                discountCodeRequest.setQuantity(d.getCodeQuantity());
            }
            discountCodeList.add(discountCodeRequest);
        }
        return discountCodeList;
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

    @Transactional
    @Override
    public PromotionDTO createPromotion(DiscountCodeRequest discountCodeRequest, String authHeader) {
        Promotions promotions = new Promotions();
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Date now = new Date();
            if (discountCodeRequest.getEndDate().after(now)) {
                if (jwtUtil.verifyToken(token)) {
                    String email = jwtUtil.getUsernameFromToken(token);
                    User manager = userRepository.findByEmail(email);
                    promotions.setPromotionName(discountCodeRequest.getName());
                    promotions.setPromotionStartDate(now);
                    promotions.setPromotionEndDate(discountCodeRequest.getEndDate());
                    promotions.setManager(manager);
                    promotionRepository.saveAndFlush(promotions);

                    DiscountCodes discountCodes = new DiscountCodes();
                    discountCodes.setPromotion(promotions);
                    discountCodes.setCode(discountCodeRequest.getCode());
                    discountCodes.setCodeQuantity(discountCodeRequest.getQuantity());
                    discountCodes.setDiscountPercentTage(discountCodeRequest.getDiscountPercent());
                    discountCodeRepository.save(discountCodes);
                }
            }

        }
        return mapPromotionToDTO(promotions);
    }

    @Override
    public PromotionDTO updatePromotion(DiscountCodeRequest discountCodeRequest) {
        Optional<Promotions> promotionsOptional = promotionRepository.findById(discountCodeRequest.getId());
        if (promotionsOptional.isPresent()) {


            Promotions promotion = promotionsOptional.get();
            promotion.setPromotionName(discountCodeRequest.getName());
            promotion.setPromotionEndDate(discountCodeRequest.getEndDate());

            for (DiscountCodes d : promotion.getDiscountCodes()) {
                d.setCodeQuantity(discountCodeRequest.getQuantity());
                d.setCode(discountCodeRequest.getCode());
                d.setDiscountPercentTage(discountCodeRequest.getDiscountPercent());
                discountCodeRepository.save(d);
            }


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
    public void deletePromotion() {
        List<Promotions> promotionsList = promotionRepository.findAll();
        List<Order> orderList = orderRepository.findAll();
        for (Promotions p : promotionsList) {
            Date now = new Date();
            if (p.getPromotionEndDate().after(now)) {
                for (Order o : orderList) {
                    if (o.getDiscountCode().getPromotion().getPromotionId() != p.getPromotionId()) {
                        promotionRepository.delete(p);
                    }
                }
            }
        }
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