package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;
import org.example.diamondshopsystem.dto.SizeDTO;

@Getter
@Setter
public class AddProductRequest {
    private Integer productId;
    private int quantity;
    private Integer sizeId;
}
