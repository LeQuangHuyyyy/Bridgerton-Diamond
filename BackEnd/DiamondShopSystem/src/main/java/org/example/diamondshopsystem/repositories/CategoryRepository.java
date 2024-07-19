package org.example.diamondshopsystem.repositories;

import org.example.diamondshopsystem.entities.Category;
import org.example.diamondshopsystem.entities.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Integer> {



}
