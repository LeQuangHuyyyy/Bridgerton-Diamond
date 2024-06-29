package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.dto.PromotionDTO;
import org.example.diamondshopsystem.payload.ResponseData;
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
    public ResponseEntity<List<PromotionDTO>> getAllPromotion() {
        List<PromotionDTO> promotionDTOList = promotionServiceImp.getAllPromotions();
        return new ResponseEntity<>(promotionDTOList, HttpStatus.OK);
    }


    @GetMapping("/search")
    public ResponseEntity<List<PromotionDTO>> getPromotion(@RequestParam(required = false) String name, @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date sDate, @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date eDate) {

        List<PromotionDTO> promotionDTOList;

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
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody PromotionDTO promotionDTO) {
        PromotionDTO promotionDTO1 = promotionServiceImp.createPromotion(promotionDTO);

        if (promotionDTO1 != null) {
            return new ResponseEntity<>(promotionDTO1, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<PromotionDTO> updatePromotion(@RequestBody PromotionDTO promotionDTO) {
        PromotionDTO promotionDTO1 = promotionServiceImp.updatePromotion(promotionDTO);
        if (promotionDTO1 == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(promotionDTO1, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData> deletePromotion(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        try {
            promotionServiceImp.deletePromotion(id);
            responseData.setStatus(204);
            responseData.setDescription("Successfully deleted Promotion");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setStatus(404);
            responseData.setSuccess(false);
            responseData.setDescription("Can not found Promotion with the given Id");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
    }
}
