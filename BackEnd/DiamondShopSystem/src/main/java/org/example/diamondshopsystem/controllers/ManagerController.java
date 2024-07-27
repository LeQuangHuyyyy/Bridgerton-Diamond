package org.example.diamondshopsystem.controllers;

import lombok.RequiredArgsConstructor;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.services.DiamondPriceService;
import org.example.diamondshopsystem.services.DiamondService;
import org.example.diamondshopsystem.services.UploadImageService;
import org.example.diamondshopsystem.services.imp.DiamondServiceImp;
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
@CrossOrigin(origins = "*")
public class ManagerController {

    @Autowired
    private UploadImageService uploadImageService;

    @Autowired
    private OrderServiceImp orderServiceImp;

    @Autowired
    private DiamondServiceImp diamondServiceImp;

    @GetMapping("/orderLastWeek")
    public ResponseEntity<?> getTotalOrderInSoldInWeek() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.getOrderSoldInLastWeek());
        responseData.setDescription("ke ke ke, lấy order trong tuần trc");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/orderThisWeek")
    public ResponseEntity<?> getTotalOrderInSoldInThisWeek() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.getOrderSoldInThisWeek());
        responseData.setDescription("ke ke ke, lấy order trong tuần này");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }


    @GetMapping("/productLastWeek")
    public ResponseEntity<?> getTotalProductInLastWeek() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.getTotalProductInLastWeek());
        responseData.setDescription("ke ke ke, lấy product trong tuần trc");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/productThisWeek")
    public ResponseEntity<?> getTotalProductInThisWeek() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.getTotalProductInTHisWeek());
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

    @GetMapping("/revenueThisWeek")
    public ResponseEntity<?> getTotalRevenueThisWeek() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.revenueThisWeek());
        responseData.setDescription("ke ke ke, lấy doanh thu trong tuần này");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/getDiamondSold")
    public ResponseEntity<?> getDiamondSoldLastWeek() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.diamondSoldByCategory());
        responseData.setDescription("ke ke ke, lấy kim cương bán ra của Heart Oval Round trong tat cả diamond dc bán ra");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/getProductSoldByCate")
    public ResponseEntity<?> getProductSoldByCate() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.getProductSoldByCategory());
        responseData.setDescription("ke ke ke, product bán ra lấy số lựng từng cate trong tất cả các mặt hàng đã bán");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/statisticBeforeThisWeek")
    public ResponseEntity<?> getStatisticBeForeThisWeek() {
        ResponseData responseData = new ResponseData();
        responseData.setData(orderServiceImp.getStatisticBeforeThisWeek());
        responseData.setDescription("ke ke ke, statistic trong tất cả các mặt hàng đã bán tính từ tuần trc");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/diamond")
    public ResponseEntity<?> getDiamondWithoutProduct(@RequestParam int productId) {
        ResponseData responseData = new ResponseData();
        responseData.setData(diamondServiceImp.getAllDiamondWithoutProduct(productId));
        responseData.setDescription("lấy diamond mà k có product");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
