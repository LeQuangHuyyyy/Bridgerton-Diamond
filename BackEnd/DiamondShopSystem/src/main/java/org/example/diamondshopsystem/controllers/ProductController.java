package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.dto.OrderDTO;
import org.example.diamondshopsystem.dto.ProductDTO;
import org.example.diamondshopsystem.dto.PromotionDTO;
import org.example.diamondshopsystem.entities.Diamond;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.services.FileService;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    ProductService productService;

    @Autowired
    FileService fileService;

    @PostMapping("/savefile")
    public ResponseEntity<ResponseData> uploadFile(@RequestParam MultipartFile file) {
        ResponseData responseData = new ResponseData();
        boolean isSuccess = fileService.saveFile(file);
        responseData.setData(isSuccess);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/load/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {

        Resource fileResource = fileService.loadFile(filename);

        try {

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileResource.getFilename() + "\"")
                    .body(fileResource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/load-image/{filename}")
    public ResponseEntity<Resource> loadImage(@PathVariable String filename) {
        Resource fileResource = fileService.loadFile(filename);

        if (fileResource != null && fileResource.exists() && fileResource.isReadable()) {
            try {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(fileResource.getFile().toPath()))
                        .body(fileResource);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return ResponseEntity.notFound().build();
    }

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
    public ResponseEntity<Page<ProductDTO>> getAllProducts(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductDTO> allProduct = productService.getAllProduct(pageable);
            return ResponseEntity.ok(allProduct);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<ProductDTO> addProduct(@RequestBody ProductDTO product) {
        ProductDTO savedProduct = productService.addProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable int id, @RequestBody ProductDTO product) {
        product.setProductId(id);
        ProductDTO updatedProduct = productService.updateProduct(product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
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

