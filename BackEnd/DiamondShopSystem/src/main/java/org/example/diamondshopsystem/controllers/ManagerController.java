package org.example.diamondshopsystem.controllers;

import lombok.RequiredArgsConstructor;
import org.example.diamondshopsystem.services.UploadImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/manager")
@RequiredArgsConstructor
public class ManagerController {

    @Autowired
    private UploadImageService uploadImageService;

    @PostMapping("/cloudinary/upload")
    public ResponseEntity<Map> uploadImage(@RequestParam("image") MultipartFile file) {
        Map data = this.uploadImageService.upload(file);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}

