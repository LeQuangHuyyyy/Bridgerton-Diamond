package org.example.diamondshopsystem.controllers;

import org.example.diamondshopsystem.entities.Size;
import org.example.diamondshopsystem.services.SizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("sizes")
@CrossOrigin(origins = "*")
public class SizeController {

    @Autowired
    SizeService sizeService;

    @GetMapping("/{categoryId}")
    public ResponseEntity<?> getSize(@PathVariable int categoryId) {
        try {
            List<Size> sizes = sizeService.getSizesByCategoryId(categoryId);

            if (sizes.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(sizes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving sizes for category: " + e.getMessage());
        }
    }
}
