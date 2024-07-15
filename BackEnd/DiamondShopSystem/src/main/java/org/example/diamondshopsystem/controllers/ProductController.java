package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.dto.ProductDTO;
import org.example.diamondshopsystem.entities.Products;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.payload.requests.ProductRequest;
import org.example.diamondshopsystem.repositories.ProductRepository;
import org.example.diamondshopsystem.services.DiamondService;
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

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    ProductService productService;

    @Autowired
    FileService fileService;
    @Autowired
    private DiamondService diamondService;
    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/saveFile")
    public ResponseEntity<ResponseData> uploadFile(@RequestParam MultipartFile[] files) {
        ResponseData responseData = new ResponseData();
        for (MultipartFile file : files) {
            boolean isSuccess = fileService.saveFile(file);
            if (!isSuccess) {
                responseData.setData(false);
                return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        responseData.setData(true);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/load/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        Resource fileResource = fileService.loadFile(filename);
        try {
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileResource.getFilename() + "\"").body(fileResource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/load-image/{filename}")
    public ResponseEntity<Resource> loadImage(@PathVariable String filename) {
        Resource fileResource = fileService.loadFile(filename);

        if (fileResource != null && fileResource.exists() && fileResource.isReadable()) {
            try {
                return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(fileResource.getFile().toPath())).body(fileResource);
            } catch (IOException ignored) {
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

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable int id, @RequestBody ProductDTO product) {
        product.setProductId(id);
        ProductDTO updatedProduct = productService.updateProduct(product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        if (productService.deleteProduct(id)) {
            responseData.setDescription("delete oke nhá ");
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

