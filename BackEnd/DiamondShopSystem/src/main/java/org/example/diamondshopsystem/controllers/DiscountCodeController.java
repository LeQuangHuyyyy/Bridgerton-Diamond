package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.dto.DiscountCodesDTO;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.services.imp.DiscountCodeServiceImp;
import org.example.diamondshopsystem.services.imp.PromotionServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manage/discountcode")
@CrossOrigin(origins = "*")
public class DiscountCodeController {

    @Autowired
    private DiscountCodeServiceImp discountCodeServiceImp;

    @Autowired
    private PromotionServiceImp promotionServiceImp;

    @GetMapping("/get-all")
    public ResponseEntity<List<DiscountCodesDTO>> getAllDiscountCode() {
        List<DiscountCodesDTO> discountCodesDTOList = discountCodeServiceImp.getAllDiscountCodes();
        return new ResponseEntity<>(discountCodesDTOList, HttpStatus.OK);
    }

    @GetMapping("/search-by-promotion/{id}")
    public ResponseEntity<ResponseData> searchDiscountCodeByPromotion(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        try {
            promotionServiceImp.getPromotionDTOById(id);
            List<DiscountCodesDTO> discountCodesDTOList = discountCodeServiceImp.getDiscountCodeByPromotionId(id);
            responseData.setStatus(200);
            responseData.setData(discountCodesDTOList);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setStatus(404);
            responseData.setSuccess(false);
            responseData.setDescription("Can not found promotion with the given Id");
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<DiscountCodesDTO>> searchDiscountCode(@RequestParam String code) {
        List<DiscountCodesDTO> discountCodesDTOList = discountCodeServiceImp.getDiscountCodesByCode(code);
        if (discountCodesDTOList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(discountCodesDTOList, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseData> createDiscountCode(@RequestBody DiscountCodesDTO discountCodeDTO) {
        ResponseData responseData = new ResponseData();
        try {

            responseData.setStatus(201);
            responseData.setDescription("Successfully created DiscountCode");
            responseData.setData(discountCodeServiceImp.createDiscountCode(discountCodeDTO));
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Exception e) {
            responseData.setStatus(404);
            responseData.setSuccess(false);
            responseData.setDescription("Can not found promotion with the given Id");
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseData> updateDiscountCode(@RequestBody DiscountCodesDTO discountCodeDTO) {
        ResponseData responseData = new ResponseData();
        try {
            DiscountCodesDTO discountCodesDTO = discountCodeServiceImp.updateDiscountCode(discountCodeDTO);
            responseData.setStatus(200);
            responseData.setDescription("Successfully updated DiscountCode");
            responseData.setData(discountCodesDTO);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setStatus(404);
            responseData.setSuccess(false);
            responseData.setDescription("Can not found code or promotion with the given Id");
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData> deleteDiscountCode(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        try {
            responseData.setStatus(204);
            discountCodeServiceImp.deleteDiscountCode(id);
            responseData.setDescription("Successfully deleted DiscountCode");
            return new ResponseEntity<>(responseData, HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            responseData.setStatus(404);
            responseData.setSuccess(false);
            responseData.setDescription("Can not found Discount code with the given Id");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
    }

}