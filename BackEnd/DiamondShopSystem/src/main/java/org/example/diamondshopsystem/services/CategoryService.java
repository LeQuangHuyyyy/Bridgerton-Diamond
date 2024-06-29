package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.CategoryDTO;
import org.example.diamondshopsystem.entities.Category;
import org.example.diamondshopsystem.repositories.CategoryRepository;
import org.example.diamondshopsystem.services.imp.CategoryServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService implements CategoryServiceImp {

    @Autowired
    CategoryRepository categoryRepository;
    @Override
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(category -> new CategoryDTO(category.getCategoryId(), category.getCategoryName()))
                .collect(Collectors.toList());
    }
}
