package org.example.diamondshopsystem.repositories;

import org.example.diamondshopsystem.entities.Diamond;
import org.example.diamondshopsystem.entities.Products;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ProductRepository extends JpaRepository<Products, Integer> {
    Page<Products> findByCollection(String collection, Pageable pageable);

    List<Products> findTop8ByOrderByPriceDesc();

    Page<Products> findAllByOrderByPriceAsc(Pageable pageable);

    Page<Products> findAllByOrderByPriceDesc(Pageable pageable);

    Page<Products> findAllByCategoryCategoryId(Integer categoryId, Pageable pageable);

    @Query("SELECT p FROM Products p WHERE  p.stockQuantity > 0 ")
    Page<Products> findAllProduct(Pageable pageable);

    @Query("SELECT p FROM Products p WHERE p.category.categoryName = :#{#categoryName}")
    Page<Products> getProductsByCategory(@Param("categoryName") String categoryName, Pageable pageable);

    @Query("SELECT p.stockQuantity FROM Products p WHERE p.productId = :productId")
    int getStockQuantityById(@Param("productId") int productId);

    @Query("SELECT p.diamonds FROM Products p WHERE p.productId = :productId")
    Set<Diamond> findSetDiamondByProductId(@Param("productId") int productId);

    @Query("SELECT p FROM Products p WHERE p.shell.shellId = :id")
    List<Products> findAllByShellID(@Param("id") int id);

    //short
    Page<Products> findAllByOrderByProductNameAsc(Pageable pageable);

    Page<Products> findAllByOrderByProductNameDesc(Pageable pageable);

    Page<Products> findAllByOrderByStockQuantityAsc(Pageable pageable);

    Page<Products> findAllByOrderByStockQuantityDesc(Pageable pageable);

    Page<Products> findByProductNameContainingIgnoreCase(String keyword, Pageable pageable);

    @Query("SELECT p FROM Products p WHERE p.price BETWEEN :minPrice AND :maxPrice ORDER BY p.price ASC")
    Page<Products> findByPriceBetweenOrderByPriceAsc(@Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice, Pageable pageable);

    @Query("SELECT p FROM Products p WHERE p.price BETWEEN :minPrice AND :maxPrice ORDER BY p.price DESC")
    Page<Products> findByPriceBetweenOrderByPriceDesc(@Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice, Pageable pageable);

    @Query("SELECT p FROM Products p WHERE p.category.categoryName = :categoryName ORDER BY p.price ASC")
    Page<Products> findByCategoryOrderByPriceAsc(@Param("categoryName") String categoryName, Pageable pageable);

    @Query("SELECT p FROM Products p WHERE p.category.categoryName = :categoryName ORDER BY p.price DESC")
    Page<Products> findByCategoryOrderByPriceDesc(@Param("categoryName") String categoryName, Pageable pageable);

    @Query("SELECT p FROM Products p WHERE " + "(:categoryName IS NULL OR p.category.categoryName = :categoryName) AND " + "(:collection IS NULL OR p.collection = :collection) AND " + "(:minPrice IS NULL OR p.price >= :minPrice) AND " + "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Products> findProductsByMultipleCriteria(@Param("categoryName") String categoryName, @Param("collection") String collection, @Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice, Pageable pageable);
}
