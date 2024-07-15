package org.example.diamondshopsystem.services.Map;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.example.diamondshopsystem.dto.DiamondDTO;
import org.example.diamondshopsystem.dto.ProductDTO;
import org.example.diamondshopsystem.entities.Category;
import org.example.diamondshopsystem.entities.Diamond;
import org.example.diamondshopsystem.entities.Products;
import org.example.diamondshopsystem.entities.Shell;
import org.example.diamondshopsystem.payload.requests.ProductRequest;
import org.example.diamondshopsystem.repositories.CategoryRepository;
import org.example.diamondshopsystem.repositories.DiamondsRepository;
import org.example.diamondshopsystem.repositories.ProductRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Transactional
@Component
public class ProductMapper {

    private final DiamondsRepository diamondsRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    @PersistenceContext
    private EntityManager entityManager;

    public ProductMapper(DiamondsRepository diamondsRepository, ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.diamondsRepository = diamondsRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

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

    public Products mapProductDTOToProduct(ProductRequest productRequest) {
        if (productRequest == null) {
            return null;
        }

        Products product = new Products();
        product.setProductId(productRequest.getProductId());
        product.setProductName(productRequest.getProductName());
        product.setPrice(productRequest.getPrice());
        product.setStockQuantity(productRequest.getStockQuantity());
        product.setCollection(productRequest.getCollection());
        product.setDescription(productRequest.getDescription());
        product.setImage1(productRequest.getImage1());
        product.setImage2(productRequest.getImage2());
        product.setImage3(productRequest.getImage3());
        product.setImage4(productRequest.getImage4());
        product.setStatus(true);
        product.setWarrantiesYear(2);

        product.setImageCertificate("https://firebasestorage.googleapis.com/v0/b/bridgertondiamond.appspot.com/o/BridgertonDiamond%2F21B31C3E-B419-46FC-8A1B-F4AC6EF284B9.jpg?alt=media&token=17f3129e-3c67-41cc-83ce-35b8b5b8732f");
        product.setCategory(categoryRepository.findById(productRequest.getCategoryId()).orElseThrow(() -> new IllegalArgumentException("cannot find category")));
        product.setWarranties(null);

        Shell shell = entityManager.find(Shell.class, productRequest.getShellId());
        if (shell != null) {
            product.setShell(shell);
        }

        Diamond diamond = diamondsRepository.findById(productRequest.getDiamondId()).orElseThrow(() -> new IllegalArgumentException("cannot find diamond"));
        if (diamond.getCut().equalsIgnoreCase("Round")) {
            product.setImageWarranties("https://firebasestorage.googleapis.com/v0/b/bridgertondiamond.appspot.com/o/BridgertonDiamond%2Fwarranty.jpg?alt=media&token=e7740f7a-13ce-4dec-bc15-37f0469a5ab0");
        }
        if (diamond.getCut().equalsIgnoreCase("Heart")) {
            product.setImageWarranties("https://firebasestorage.googleapis.com/v0/b/bridgertondiamond.appspot.com/o/BridgertonDiamond%2Fwarranty.jpg?alt=media&token=e7740f7a-13ce-4dec-bc15-37f0469a5ab0");
        }
        if (diamond.getCut().equalsIgnoreCase("Oval")) {
            product.setImageWarranties("https://firebasestorage.googleapis.com/v0/b/bridgertondiamond.appspot.com/o/BridgertonDiamond%2Fwarranty.jpg?alt=media&token=e7740f7a-13ce-4dec-bc15-37f0469a5ab0");
        }
        product.setDiamonds(Set.of(diamond));

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
