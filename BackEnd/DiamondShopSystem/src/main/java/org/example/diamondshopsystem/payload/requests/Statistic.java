package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class Statistic {
    private String date;
    private double totalSale;
    private int totalOrder;
    private int totalItem;
}
