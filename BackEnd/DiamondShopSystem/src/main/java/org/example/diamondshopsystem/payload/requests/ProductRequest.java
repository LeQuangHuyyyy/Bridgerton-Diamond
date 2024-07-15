package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;
import org.example.diamondshopsystem.dto.DiamondDTO;

import java.util.Set;

@Getter
@Setter
public class ProductRequest {
    private int productId;

    private String productName;

    private double price;

    private int stockQuantity;

    private String collection;

    private String description;

    private String image1;

    private String image2;

    private String image3;

    private String image4;

    private String certificateImage;

    private String WarrantyImage;

    private int categoryId;

    private int diamondId;

    private int shellId;
}
