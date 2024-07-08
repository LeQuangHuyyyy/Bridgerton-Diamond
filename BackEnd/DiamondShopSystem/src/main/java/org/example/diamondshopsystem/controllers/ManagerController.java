package org.example.diamondshopsystem.controllers;

import lombok.RequiredArgsConstructor;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.services.UploadImageService;
import org.example.diamondshopsystem.services.imp.OrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/manager")
@RequiredArgsConstructor
public class ManagerController {

    @Autowired
    private UploadImageService uploadImageService;

    @Autowired
    private OrderServiceImp orderServiceImp;

    @PostMapping("/cloudinary/upload")
    public ResponseEntity<Map> uploadImage(@RequestParam("image") MultipartFile file) {
        Map data = this.uploadImageService.upload(file);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/orderLastWeek")
    public ResponseEntity<?> getTotalOrderInSoldInWeek() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.getOrderSoldInLastWeek());
        responseData.setDescription("ke ke ke, lấy order trong tuần trc");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/productLastWeek")
    public ResponseEntity<?> getTotalProductInLastWeek() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.getTotalProductInLastWeek());
        responseData.setDescription("ke ke ke, lấy product trong tuần trc");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/revenueLastWeek")
    public ResponseEntity<?> getTotalRevenueLastWeek() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.revenueLastWeek());
        responseData.setDescription("ke ke ke, lấy doanh thu trong tuần trc");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/getDiamondSold")
    public ResponseEntity<?> getDiamondSoldLastWeek() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.diamondSoldByCategory());
        responseData.setDescription("ke ke ke, lấy kim cương bán ra của Heart Oval Round trong tuần trc");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/getProductSoldByCate")
    public ResponseEntity<?> getProductSoldByCate() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.getProductSoldByCategory());
        responseData.setDescription("ke ke ke, product bán ra lấy số lựng từng cate trong tuần trc");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
