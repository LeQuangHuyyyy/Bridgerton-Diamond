package org.example.diamondshopsystem.payload.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DiamondCategory {
    private String date;
    private int heart;
    private int round;
    private int oval;
}