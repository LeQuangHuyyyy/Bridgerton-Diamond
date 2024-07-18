package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.dto.PromotionDTO;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.payload.requests.DiscountCodeRequest;
import org.example.diamondshopsystem.services.imp.PromotionServiceImp;
import org.example.diamondshopsystem.services.imp.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/manage/promotion")
@CrossOrigin(origins = "*")
public class PromotionController {
    @Autowired
    UserServiceImp userServiceImp;

    @Autowired
    PromotionServiceImp promotionServiceImp;

    @GetMapping("get-all")
    public ResponseEntity<?> getAllPromotion() {
        List<DiscountCodeRequest> discountCodeRequestList = promotionServiceImp.getAllPromotions();
        return new ResponseEntity<>(discountCodeRequestList, HttpStatus.OK);
    }


    @GetMapping("/search")
    public ResponseEntity<?> getPromotion(@RequestParam(required = false) String name, @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date sDate, @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date eDate) {

        List<?> promotionDTOList;

        if (name != null && sDate != null && eDate != null) {
            promotionDTOList = promotionServiceImp.getPromotionByDateRangeAndName(name, sDate, eDate);
        } else if (name != null && (sDate == null && eDate == null)) {
            promotionDTOList = promotionServiceImp.getPromotionsByName(name);
        } else if (name == null && sDate != null && eDate != null) {
            promotionDTOList = promotionServiceImp.getPromotionsByDateRange(sDate, eDate);
        } else {
            promotionDTOList = promotionServiceImp.getAllPromotions();
        }

        return new ResponseEntity<>(promotionDTOList, HttpStatus.OK);
    }


    @PostMapping("/create")
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody DiscountCodeRequest discountCodeRequest, @RequestHeader("Authorization") String authHeader) {
        PromotionDTO promotionDTO1 = promotionServiceImp.createPromotion(discountCodeRequest, authHeader);
        if (promotionDTO1 != null) {
            return new ResponseEntity<>(promotionDTO1, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<PromotionDTO> updatePromotion(@RequestBody DiscountCodeRequest discountCodeRequest) {
        PromotionDTO promotionDTO1 = promotionServiceImp.updatePromotion(discountCodeRequest);
        if (promotionDTO1 == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(promotionDTO1, HttpStatus.OK);
    }


}
