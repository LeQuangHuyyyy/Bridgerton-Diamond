package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.dto.DiamondDTO;
import org.example.diamondshopsystem.dto.DiamondPriceDTO;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.services.DiamondPriceService;
import org.example.diamondshopsystem.services.imp.DiamondPriceServiceImp;
import org.example.diamondshopsystem.services.imp.DiamondServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/manage/diamond-price")
@CrossOrigin(origins = "*")
public class DiamondPriceController {

    @Autowired
    private DiamondPriceServiceImp diamondPriceServiceImp;

    @Autowired
    private DiamondServiceImp diamondServiceImp;

    @GetMapping("/get-all")
    public ResponseEntity<List<DiamondPriceDTO>> getAll() {
        List<DiamondPriceDTO> diamondPriceDTOS = diamondPriceServiceImp.getAllDiamondPrices();
        return new ResponseEntity<>(diamondPriceDTOS, HttpStatus.OK);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<ResponseData> getById(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        try {
            DiamondPriceDTO diamondPriceDTO = diamondPriceServiceImp.getDiamondPrice(id);
            responseData.setStatus(200);
            responseData.setSuccess(true);
            responseData.setDescription("Diamond price retrieved successfully");
            responseData.setData(diamondPriceDTO);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            responseData.setStatus(404);
            responseData.setSuccess(false);
            responseData.setDescription("Diamond price not found");
            responseData.setData(null);
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            responseData.setStatus(500);
            responseData.setSuccess(false);
            responseData.setDescription("Failed to retrieve diamond price");
            responseData.setData(null);
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<DiamondPriceDTO> create(@RequestBody DiamondPriceDTO diamondPriceDTO) {
        try {
            DiamondPriceDTO diamondPriceDTO1 = diamondPriceServiceImp.getDiamondPriceBy4C(diamondPriceDTO.getCarat(), diamondPriceDTO.getCut(), diamondPriceDTO.getColor(), diamondPriceDTO.getClarity());

            DiamondPriceDTO result;

            if (diamondPriceDTO1 == null) {
                result = diamondPriceServiceImp.createDiamondPrice(diamondPriceDTO);
                diamondServiceImp.updateDiamondPrice(result);
                return new ResponseEntity<>(result, HttpStatus.CREATED);
            } else {
                diamondPriceDTO.setDiamondId(diamondPriceDTO1.getDiamondId());
                result = diamondPriceServiceImp.updateDiamondPrice(diamondPriceDTO);
                diamondServiceImp.updateDiamondPrice(result);
                return new ResponseEntity<>(result, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseData> update(@RequestBody DiamondPriceDTO diamondPriceDTO) {
        ResponseData responseData = new ResponseData();
        try {
            DiamondPriceDTO diamondPriceDTO1 = diamondPriceServiceImp.updateDiamondPrice(diamondPriceDTO);
            diamondServiceImp.updateDiamondPrice(diamondPriceDTO1);
            responseData.setStatus(200);
            responseData.setSuccess(true);
            responseData.setDescription("Diamond price updated successfully");
            responseData.setData(diamondPriceDTO1);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            responseData.setStatus(404);
            responseData.setSuccess(false);
            responseData.setDescription("Diamond price not found");
            responseData.setData(null);
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            responseData.setStatus(500);
            responseData.setSuccess(false);
            responseData.setDescription("Diamond price update failed");
            responseData.setData(null);
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseData> delete(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        try {
            DiamondPriceDTO diamondPrice = diamondPriceServiceImp.deleteDiamondPrice(id);
            responseData.setData(diamondPrice);
            diamondPrice.setPrice(0);
            diamondServiceImp.updateDiamondPrice(diamondPrice);
            responseData.setStatus(200);
            responseData.setSuccess(true);
            responseData.setDescription("Diamond price deleted successfully");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            responseData.setStatus(404);
            responseData.setSuccess(false);
            responseData.setDescription("Diamond price not found");
            responseData.setData(null);
            return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            responseData.setStatus(500);
            responseData.setSuccess(false);
            responseData.setDescription("Diamond price delete failed");
            responseData.setData(null);
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
