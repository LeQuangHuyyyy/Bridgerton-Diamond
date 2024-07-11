
package org.example.diamondshopsystem.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.example.diamondshopsystem.dto.DiscountCodesDTO;
import org.example.diamondshopsystem.entities.DiscountCodes;
import org.example.diamondshopsystem.entities.Promotions;
import org.example.diamondshopsystem.repositories.DiscountCodeRepository;
import org.example.diamondshopsystem.services.imp.DiscountCodeServiceImp;
import org.example.diamondshopsystem.services.imp.PromotionServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class DiscountCodeService implements DiscountCodeServiceImp {

    private final DiscountCodeRepository discountCodeRepository;

    @Autowired
    public DiscountCodeService(DiscountCodeRepository discountCodeRepository) {
        this.discountCodeRepository = discountCodeRepository;
    }

    @Autowired
    PromotionServiceImp promotionServiceImp;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<DiscountCodesDTO> getAllDiscountCodes() {
        List<DiscountCodesDTO> discountCodesDTOList = new ArrayList<>();
        List<DiscountCodes> discountCodesList = discountCodeRepository.findAll();
        for (DiscountCodes discountCode : discountCodesList) {
            DiscountCodesDTO discountCodesDTO = mapDiscountCodeToDTO(discountCode);
            discountCodesDTOList.add(discountCodesDTO);
        }
        return discountCodesDTOList;
    }

    @Override
    public DiscountCodesDTO getDiscountCodeById(int id) {
        DiscountCodes discountCodes = discountCodeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Discount not found"));
        return mapDiscountCodeToDTO(discountCodes);
    }

    @Override
    public List<DiscountCodesDTO> getDiscountCodeByPromotionId(int promotionId) {
        List<DiscountCodes> discountCodesList = discountCodeRepository.findAllByPromotionId(promotionId);
        List<DiscountCodesDTO> discountCodesDTOList = new ArrayList<>();
        for (DiscountCodes discountCode : discountCodesList) {
            DiscountCodesDTO discountCodesDTO = mapDiscountCodeToDTO(discountCode);
            discountCodesDTOList.add(discountCodesDTO);
        }
        return discountCodesDTOList;
    }

    @Override
    public List<DiscountCodesDTO> getDiscountCodesByCode(String code) {
        List<DiscountCodesDTO> discountCodesDTOList = new ArrayList<>();
        List<DiscountCodes> discountCodes = discountCodeRepository.findAllByDiscountCode(code);
        for (DiscountCodes discountCode : discountCodes) {
            DiscountCodesDTO discountCodesDTO = mapDiscountCodeToDTO(discountCode);
            discountCodesDTOList.add(discountCodesDTO);
        }
        return discountCodesDTOList;
    }

    @Transactional
    @Override
    public DiscountCodesDTO createDiscountCode(DiscountCodesDTO discountCodeDTO) {
        DiscountCodes discountCodes = new DiscountCodes();
        discountCodes.setCode(discountCodeDTO.getCode());
        discountCodes.setDiscountPercentTage(discountCodeDTO.getDiscountPercentTage());
        discountCodes.setCodeQuantity(discountCodeDTO.getCodeQuantity());

        Promotions promotions = promotionServiceImp.getPromotionById(discountCodeDTO.getPromotionID());
        promotions = entityManager.merge(promotions);
        discountCodes.setPromotion(promotions);

        DiscountCodes savedDiscountCode = discountCodeRepository.save(discountCodes);
        return mapDiscountCodeToDTO(savedDiscountCode);
    }

    @Override
    public DiscountCodesDTO updateDiscountCode(DiscountCodesDTO discountCodeDTO) {
        DiscountCodes discountCodes = discountCodeRepository.findById(discountCodeDTO.getCodeId())
                .orElseThrow(() -> new NoSuchElementException("Discount not found"));
        discountCodes.setCode(discountCodeDTO.getCode());
        discountCodes.setDiscountPercentTage(discountCodeDTO.getDiscountPercentTage());
        discountCodes.setCodeQuantity(discountCodeDTO.getCodeQuantity());

        Promotions promotions = promotionServiceImp.getPromotionById(discountCodeDTO.getPromotionID());
        promotions = entityManager.merge(promotions);
        discountCodes.setPromotion(promotions);

        DiscountCodes savedDiscountcode = discountCodeRepository.save(discountCodes);
        return mapDiscountCodeToDTO(savedDiscountcode);
    }

    @Override
    public DiscountCodesDTO deleteDiscountCode(int id) {
        DiscountCodes discountCodes = discountCodeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Discount not found"));
        discountCodeRepository.delete(discountCodes);
        return mapDiscountCodeToDTO(discountCodes);
    }

    @Override
    public double getDiscountCodePercentage(String code) {
        try {
            DiscountCodes discountCodes = discountCodeRepository.findByCode(code);
            return discountCodes.getDiscountPercentTage();
        } catch (NullPointerException e) {
            return 0;
        }
    }

    @Override
    public double useDiscountCode(String code) {
        try {
            DiscountCodes discountCodes = discountCodeRepository.findByCode(code);
            DiscountCodes discountCodes1 = discountCodeRepository.findById(discountCodes.getCodeId())
                    .orElseThrow(() -> new NoSuchElementException("Discount not found"));
            discountCodes1.setCodeQuantity(discountCodes.getCodeQuantity() - 1);
            discountCodeRepository.save(discountCodes1);

            return discountCodes.getDiscountPercentTage();
        } catch (NullPointerException e) {
            return 0;
        }
    }

    private DiscountCodesDTO mapDiscountCodeToDTO(DiscountCodes discountCode) {
        DiscountCodesDTO discountCodeDTO = new DiscountCodesDTO();
        discountCodeDTO.setCodeId(discountCode.getCodeId());
        discountCodeDTO.setCode(discountCode.getCode());
        discountCodeDTO.setDiscountPercentTage(discountCode.getDiscountPercentTage());
        discountCodeDTO.setCodeQuantity(discountCode.getCodeQuantity());
        discountCodeDTO.setPromotionID(discountCode.getPromotion().getPromotionId());
        return discountCodeDTO;
    }
}
