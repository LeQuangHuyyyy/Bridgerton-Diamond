package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.SizeDTO;
import org.example.diamondshopsystem.entities.Size;

import java.util.List;

public interface SizeServiceImp {
    List<Size> getSizesByCategoryId(int categoryId);
}
