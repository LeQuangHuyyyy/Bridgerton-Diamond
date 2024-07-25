package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.dto.ProductDTO;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.payload.requests.ProductRequest;
import org.example.diamondshopsystem.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    ProductService productService;

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable int id) {
        ProductDTO product = productService.getProductDTOById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<Page<ProductDTO>> getAllProducts(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductDTO> allProduct = productService.getAllProduct(pageable);
            return ResponseEntity.ok(allProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody ProductRequest productRequest) {
        ResponseData responseData = new ResponseData();
        if (productService.addProduct(productRequest)) {
            responseData.setDescription("add ok !");
        } else {
            responseData.setDescription("add fail!!");
        }
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProduct(@RequestBody ProductRequest productRequest) {
        ResponseData responseData = new ResponseData();
        if (productService.updateProduct(productRequest)) {
            responseData.setDescription("update ok nhá!");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } else {
            responseData.setDescription("update fail!!");
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteProduct(@RequestParam int id) {
        ResponseData responseData = new ResponseData();
        if (productService.deleteProduct(id)) {
            responseData.setDescription("delete oke nhá");
        } else {
            responseData.setDescription("delete sai gòi, bị gì gòi á");
        }
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/setprice")
    public void updateProductPricesOnStartup() {
        System.out.println("Hello controller");
        productService.updateProductPricesOnStartup();
    }

    @PostMapping("/fetch-quantity")
    public void fetchProductQuantity() {
        productService.resetAllStockQuantity();
    }

    @PostMapping("/fetch-diamond-set")
    public void fetchDiamondSet() {
        productService.updateProductDiamondSet();
    }



}

