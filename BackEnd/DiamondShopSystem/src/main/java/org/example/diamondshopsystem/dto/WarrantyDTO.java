package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class WarrantyDTO {

    private int warrantyId;
    private String warrantyCode;

    private Date warrantyStartDate;

    private Date warrantyExpirationDate;

    private int orderId;

    private int productId;

    private String productName;

    List<DiamondDTO> diamondDto;

}
