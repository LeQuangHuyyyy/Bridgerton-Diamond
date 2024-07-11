package org.example.diamondshopsystem.services.Map;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.example.diamondshopsystem.dto.DiamondDTO;
import org.example.diamondshopsystem.dto.ProductDTO;
import org.example.diamondshopsystem.entities.Diamond;
import org.example.diamondshopsystem.entities.Products;
import org.example.diamondshopsystem.entities.Shell;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Transactional
@Component
public class ProductMapper {

    @PersistenceContext
    private EntityManager entityManager;

    public ProductDTO mapProductToDTO(Products products) {
        if (products == null) {
            return null;
        }

        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductId(products.getProductId());
        productDTO.setProductName(products.getProductName());
        productDTO.setPrice(products.getPrice());
        productDTO.setStockQuantity(products.getStockQuantity());
        productDTO.setCollection(products.getCollection());
        productDTO.setDescription(products.getDescription());
        productDTO.setImage1(products.getImage1());
        productDTO.setImage2(products.getImage2());
        productDTO.setImage3(products.getImage3());
        productDTO.setImage4(products.getImage4());
        productDTO.setCategoryId(products.getCategory().getCategoryId());
        productDTO.setShellId(products.getShell().getShellId());
        productDTO.setCertificateImage(products.getImageCertificate());
        productDTO.setWarrantyImage(products.getImageWarranties());

        // Map Diamonds
        Set<DiamondDTO> diamondDTOs = products.getDiamonds().stream().map(diamond -> new DiamondDTO(diamond.getDiamondId(), diamond.getCarat(), diamond.getPrice(), diamond.getCut(), diamond.getColor(), diamond.getClarity(), diamond.getCertification(), diamond.getProduct().getProductId(), diamond.isStatus())).collect(Collectors.toSet());
        productDTO.setDiamonds(diamondDTOs);

        return productDTO;
    }

    public Products mapProductDTOToProduct(ProductDTO productDTO) {
        if (productDTO == null) {
            return null;
        }

        Products product = new Products();
        product.setProductId(productDTO.getProductId());
        product.setProductName(productDTO.getProductName());
        product.setPrice(productDTO.getPrice());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setCollection(productDTO.getCollection());
        product.setDescription(productDTO.getDescription());
        product.setImage1(productDTO.getImage1());
        product.setImage2(productDTO.getImage2());
        product.setImage3(productDTO.getImage3());
        product.setImage4(productDTO.getImage4());

        // Map Shell
        Shell shell = entityManager.find(Shell.class, productDTO.getShellId());
        if (shell != null) {
            product.setShell(shell);
        }

        // Map Diamonds
        Set<Diamond> diamonds = productDTO.getDiamonds().stream().map(diamondDTO -> entityManager.find(Diamond.class, diamondDTO.getDiamondId())) // Assuming DiamondDTO has getId method
                .filter(diamond -> diamond != null).collect(Collectors.toSet());
        product.setDiamonds(diamonds);

        return product;
    }

    public void mapProductDTOToProduct(ProductDTO productDTO, Products product) {
        if (productDTO == null || product == null) {
            return;
        }

        product.setProductId(productDTO.getProductId());
        product.setProductName(productDTO.getProductName());
        product.setPrice(productDTO.getPrice());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setCollection(productDTO.getCollection());
        product.setDescription(productDTO.getDescription());
        product.setImage1(productDTO.getImage1());
        product.setImage2(productDTO.getImage2());
        product.setImage3(productDTO.getImage3());
        product.setImage4(productDTO.getImage4());

        // Map Shell
        Shell shell = entityManager.find(Shell.class, productDTO.getShellId());
        if (shell != null) {
            product.setShell(shell);
        }

        // Map Diamonds
        Set<Diamond> diamonds = productDTO.getDiamonds().stream().map(diamondDTO -> entityManager.find(Diamond.class, diamondDTO.getDiamondId())).filter(diamond -> diamond != null).collect(Collectors.toSet());
        product.setDiamonds(diamonds);
    }
}
