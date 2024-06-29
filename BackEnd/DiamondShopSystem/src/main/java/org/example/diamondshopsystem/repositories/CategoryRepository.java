package org.example.diamondshopsystem.repositories;

import org.example.diamondshopsystem.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
