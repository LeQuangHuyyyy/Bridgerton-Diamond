package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.diamondshopsystem.entities.Size;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class OrderDetailDTO {

    private int orderId;

    private int productId;

    private int quantity;

    private double price;

    private double size;
}
