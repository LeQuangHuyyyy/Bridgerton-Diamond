package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.diamondshopsystem.entities.Diamond;

import java.util.Set;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ProductDTO {

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
    private double warrantiesYear;

    private String certificateImage;

    private String WarrantyImage;

    private int categoryId;

    private Set<DiamondDTO> diamonds;

    private int shellId;

}
