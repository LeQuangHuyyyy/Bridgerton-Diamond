package org.example.diamondshopsystem.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CartDTO {
    private int productId;
    private String productName;
    private String image1;
    private BigDecimal totalPrice;
    private int quantity;
    private double size;
    private int sizeId;
}
