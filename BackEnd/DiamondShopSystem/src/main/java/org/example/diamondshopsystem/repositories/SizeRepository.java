package org.example.diamondshopsystem.repositories;


import org.example.diamondshopsystem.entities.Category;
import org.example.diamondshopsystem.entities.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SizeRepository extends JpaRepository<Size, Integer> {
Optional<Size> findByValueSize(double valueSize);
Size findByValueSizeAndCategory(double valueSize, Category category);
    List<Size> findByCategoryCategoryId(int categoryId);
}
