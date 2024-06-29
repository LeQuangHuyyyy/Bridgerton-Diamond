package org.example.diamondshopsystem.services;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.*;
import com.cloudinary.utils.ObjectUtils;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.Map;


import java.io.IOException;
import java.util.Map;

@Service
public class UploadImageService {



    public Map upload(MultipartFile file)  {
        try{
            Dotenv dotenv = Dotenv.load();
            Cloudinary cloudinary = new Cloudinary(dotenv.get("CLOUDINARY_URL"));
            cloudinary.config.secure = true;

            String fileName = file.getOriginalFilename();
            if (fileName != null && fileName.contains(".")) {
                fileName = fileName.substring(0, fileName.lastIndexOf('.'));
            }


            Map data = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", fileName,
                            "unique_filename", "false",
                            "overwrite", "true")
                    );
            return data;
        }catch (IOException io){
            throw new RuntimeException("Image upload fail");
        }
    }

}

