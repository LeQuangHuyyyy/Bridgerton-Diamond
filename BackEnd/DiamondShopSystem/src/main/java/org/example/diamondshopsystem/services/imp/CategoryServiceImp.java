package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.CategoryDTO;
import org.example.diamondshopsystem.entities.Category;

import java.util.List;

public interface CategoryServiceImp {
    List<CategoryDTO> getAllCategories();
}
