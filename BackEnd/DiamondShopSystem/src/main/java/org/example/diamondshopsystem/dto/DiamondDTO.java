package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.diamondshopsystem.entities.Products;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class DiamondDTO {

    private int diamondId;

    private double carat;

    private double price;

    private String cut;

    private String color;

    private String clarity;

    private String certification;

    private int productId;

    private boolean status;
}
