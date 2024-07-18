package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Getter
@Setter
public class DiscountCodeRequest {
    private int id;
    private String name;
    private Date startDate;
    private Date endDate;
    private String code;
    private int discountPercent;
    private int quantity;
    private int managerId;
}
