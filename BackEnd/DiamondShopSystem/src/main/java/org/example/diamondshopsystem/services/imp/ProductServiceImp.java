package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.ProductDTO;
import org.example.diamondshopsystem.entities.Diamond;
import org.example.diamondshopsystem.entities.Products;
import org.example.diamondshopsystem.entities.Shell;
import org.example.diamondshopsystem.payload.requests.ProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductServiceImp {
    ProductDTO getProductDTOById(int id);

    Products getProductById(int id);

    boolean addProduct(ProductRequest product);

    boolean updateProduct(ProductRequest product);

    boolean deleteProduct(int id);

    Page<ProductDTO> getProductByCollection(String collection, Pageable pageable);

    List<ProductDTO> getFeaturedProduct();

    double calculateTotalPrice(int id);

    Page<ProductDTO> getAllProduct(Pageable pageable);

    Page<ProductDTO> getProductByCategory(String categoryName, Pageable pageable);

    Page<ProductDTO> getProductStoredByPrice(String order, Pageable pageable);

    void updateProductPrice(Diamond diamond);

    void updateProductPrice(Shell shell);

    Page<ProductDTO> getAllProductByCategory(int categoryId, Pageable pageable);

    //short
    Page<ProductDTO> getProductsSortedByName(String direction, Pageable pageable);

    Page<ProductDTO> getProductsSortedByStockQuantity(String direction, Pageable pageable);

    Page<ProductDTO> getProductsByNameKeyword(String keyword, Pageable pageable);

    Page<ProductDTO> getProductsByPriceRange(double minPrice, double maxPrice, String direction, Pageable pageable);

    Page<ProductDTO> getProductsByCategorySortedByPrice(String categoryName, String direction, Pageable pageable);

    Page<ProductDTO> getProductsByMultipleCriteria(String categoryName, String collection, Double minPrice, Double maxPrice, Pageable pageable);

    void resetAllStockQuantity();

    void updateProductQuantity(int id);

    void updateProductDiamondSet();

    void updateQuantityPay(int orderId);
}
