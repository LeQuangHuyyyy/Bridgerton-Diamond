package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.diamondshopsystem.entities.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SizeDTO {
    private int sizeId;
    private double sizeValue;
    private int categoryId;
    public Size toSize() {
        Size size = new Size();
        size.setSizeId(sizeId);
        size.setValueSize(sizeValue);
        return size;
    }
}
