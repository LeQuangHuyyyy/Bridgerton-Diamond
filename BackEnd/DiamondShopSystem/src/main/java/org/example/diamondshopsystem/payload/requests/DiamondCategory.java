package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class DiamondCategory {
    private Date soldDate;
    private String diamondShape;
    private int shapeQuantity;

}