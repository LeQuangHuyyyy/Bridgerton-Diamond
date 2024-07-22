package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.DiamondDTO;
import org.example.diamondshopsystem.dto.ProductDTO;
import org.example.diamondshopsystem.entities.*;

import org.example.diamondshopsystem.payload.requests.ProductRequest;
import org.example.diamondshopsystem.repositories.*;
import org.example.diamondshopsystem.services.Map.ProductMapper;
import org.example.diamondshopsystem.services.exeptions.ProductNotFoundException;
import org.example.diamondshopsystem.services.imp.ProductServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Transactional
@Service
public class ProductService implements ProductServiceImp {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    DiamondsRepository diamondsRepository;

    @Autowired
    ShellRepository shellRepository;

    @Autowired
    ProductMapper productMapper;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    OrderRepository orderRepository;


    @Override
    public ProductDTO getProductDTOById(int id) {
        Optional<Products> ProductOptional = productRepository.findById(id);
        if (ProductOptional.isPresent()) {
            Products products = ProductOptional.get();
            return productMapper.mapProductToDTO(products);
        }
        return null;
    }

    @Override
    public Products getProductById(int id) {
        Products products = productRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Can not find product with id: " + id));
        return products;
    }

    @Transactional
    @Override
    public boolean addProduct(ProductRequest productRequest) {
        Products products = new Products();
        products.setProductName(productRequest.getProductName());
        products.setStockQuantity(1);
        products.setCollection(productRequest.getCollection());
        products.setDescription(productRequest.getDescription());
        products.setImage1(productRequest.getImage1());
        products.setImage2(productRequest.getImage2());
        products.setImage3(productRequest.getImage3());
        products.setImage4(productRequest.getImage4());
        products.setWarrantiesYear(2);

        Diamond diamond = diamondsRepository.findById(productRequest.getDiamondId()).orElseThrow(() -> new IllegalArgumentException("This diamond not found"));

        Map<String, String> cutToWarrantyImage = Map.of("Round", "https://firebasestorage.googleapis.com/v0/b/bridgertondiamond.appspot.com/o/BridgertonDiamond%2Fwarranty.jpg?alt=media&token=e7740f7a-13ce-4dec-bc15-37f0469a5ab0", "Heart", "https://firebasestorage.googleapis.com/v0/b/bridgertondiamond.appspot.com/o/BridgertonDiamond%2Fwarranty.jpg?alt=media&token=e7740f7a-13ce-4dec-bc15-37f0469a5ab0", "Oval", "https://firebasestorage.googleapis.com/v0/b/bridgertondiamond.appspot.com/o/BridgertonDiamond%2Fwarranty.jpg?alt=media&token=e7740f7a-13ce-4dec-bc15-37f0469a5ab0");

        if (cutToWarrantyImage.containsKey(diamond.getCut())) {
            products.setImageWarranties(cutToWarrantyImage.get(diamond.getCut()));
        }

        products.setImageCertificate("https://firebasestorage.googleapis.com/v0/b/bridgertondiamond.appspot.com/o/BridgertonDiamond%2F21B31C3E-B419-46FC-8A1B-F4AC6EF284B9.jpg?alt=media&token=17f3129e-3c67-41cc-83ce-35b8b5b8732f");
        products.setStatus(true);

        Category category = categoryRepository.findById(productRequest.getCategoryId()).orElseThrow(() -> new IllegalArgumentException("Cannot found category"));
        products.setCategory(category);

        Shell shell = shellRepository.findById(productRequest.getShellId()).orElseThrow(() -> new IllegalArgumentException("Cannot found shell"));
        products.setShell(shell);
        products.setDiamonds(Set.of(diamond));

        double tax = (diamond.getPrice() + shell.getShellPrice()) * 10 / 100;
        double price = diamond.getPrice() + shell.getShellPrice() + tax + 50;
        products.setPrice(price);

        try {
            productRepository.saveAndFlush(products);
            Diamond setDiamond = diamondsRepository.findById(productRequest.getDiamondId()).get();
            setDiamond.setProduct(products);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    @Override
    public boolean updateProduct(ProductRequest productRequest) {
        try {
            Products products = productRepository.findById(productRequest.getProductId()).orElseThrow(() -> new IllegalArgumentException("Cannot find product!!!"));

            Set<Diamond> diamonds = products.getDiamonds();
            for (Diamond d : diamonds) {
                Diamond diamond = diamondsRepository.findById(d.getDiamondId()).orElseThrow(() -> new IllegalArgumentException("Cannot find Diamond in product"));
                diamond.setProduct(null);
                diamondsRepository.saveAndFlush(diamond);
            }

            products.setProductName(productRequest.getProductName());
            products.setPrice(productRequest.getPrice());
            products.setCollection(productRequest.getCollection());
            products.setDescription(productRequest.getDescription());
            products.setImage1(productRequest.getImage1());
            products.setImage2(productRequest.getImage2());
            products.setImage3(productRequest.getImage3());
            products.setImage4(productRequest.getImage4());
            products.setImageWarranties(productRequest.getWarrantyImage());
            products.setImageCertificate(productRequest.getCertificateImage());

            Shell shell = shellRepository.findById(productRequest.getShellId()).orElseThrow(() -> new IllegalArgumentException("Cannot find shell"));
            products.setShell(shell);

            Category category = categoryRepository.findById(productRequest.getCategoryId()).orElseThrow(() -> new IllegalArgumentException("Cannot find category"));
            products.setCategory(category);

            Set<Diamond> updatedDiamonds = new HashSet<>();
            Diamond newDiamond = diamondsRepository.findById(productRequest.getDiamondId()).orElseThrow(() -> new IllegalArgumentException("Cannot find any diamond"));
            updatedDiamonds.add(newDiamond);

            double tax = (newDiamond.getPrice() + shell.getShellPrice()) * 10 / 100;
            double price = newDiamond.getPrice() + shell.getShellPrice() + tax + 50;
            products.setPrice(price);

            products.setDiamonds(updatedDiamonds);

            productRepository.save(products);

            newDiamond.setProduct(products);
            diamondsRepository.save(newDiamond);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    @Override
    public boolean deleteProduct(int id) {
        Products products = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("cannot find product"));
        try {
            products.setStockQuantity(0);
            productRepository.save(products);
            return true;
        } catch (Exception ignored) {
        }
        return false;
    }

    @Override
    public Page<ProductDTO> getProductByCollection(String collection, Pageable pageable) {
        Page<Products> productList = productRepository.findByCollection(collection, pageable);
        return productList.map(productMapper::mapProductToDTO);
    }

    @Override
    public List<ProductDTO> getFeaturedProduct() {
        List<Products> topProducts = productRepository.findTop8ByOrderByPriceDesc();
        if (!topProducts.isEmpty()) {
            List<ProductDTO> featuredProducts = new ArrayList<>();
            for (Products product : topProducts) {
                featuredProducts.add(productMapper.mapProductToDTO(product));
            }
            return featuredProducts;
        } else {
            throw new ProductNotFoundException("No featured products found.");
        }
    }

    @Override
    public double calculateTotalPrice(int id) {
        ProductDTO product = getProductDTOById(id);
        if (product == null) {
            throw new NoSuchElementException("Product not found with id: " + id);
        }

        double diamondPrice = 0.0;
        double shellPrice = 0.0;

        for (DiamondDTO d : product.getDiamonds()) {
            diamondPrice += d.getPrice();
        }

        if (product.getShellId() != 0) {
            Shell shell = shellRepository.findById(product.getShellId()).orElseThrow(() -> new NoSuchElementException("Cannot find shell with shell id: " + product.getShellId()));
            shellPrice = shell.getShellPrice();
        }

        double tax = (diamondPrice + shellPrice) * 10 / 100;
        return (diamondPrice + shellPrice) + tax + 50;
    }

    @Override
    public Page<ProductDTO> getAllProduct(Pageable pageable) {
        List<Products> products = productRepository.findAll();
        for (Products p : products) {
            p.setPrice(calculateTotalPrice(p.getProductId()));
            productRepository.save(p);
        }

        return productRepository.findAllProduct(pageable).map(productMapper::mapProductToDTO);
    }

    @Override
    public Page<ProductDTO> getProductByCategory(String categoryName, Pageable pageable) {
        Page<Products> productsPage = productRepository.getProductsByCategory(categoryName, pageable);
        return productsPage.map(productMapper::mapProductToDTO);
    }

    @Override
    public Page<ProductDTO> getProductStoredByPrice(String order, Pageable pageable) {
        Page<Products> productsPage;
        if (order.equals("asc")) {
            productsPage = productRepository.findAllByOrderByPriceAsc(pageable);
        } else {
            productsPage = productRepository.findAllByOrderByPriceDesc(pageable);
        }

        return productsPage.map(productMapper::mapProductToDTO);
    }

    @Override
    public void updateProductPrice(Diamond diamond) {
        if (diamond == null || diamond.getDiamondId() == 0 || diamond.getProduct() == null) {
            return;
        } else {
            Products product = diamond.getProduct();

//            Set<Diamond> diamondSet = productRepository.findSetDiamondByProductId(product.getProductId());
            Set<Diamond> diamondSet = diamondsRepository.findByProductId(product.getProductId());

            //Lay phann tu dau tien cua set
            if (diamondSet != null && !diamondSet.isEmpty()) {
                Diamond diamond1 = diamondSet.iterator().next();
                if (diamond1.getDiamondId() == diamond.getDiamondId()) {
                    double totalPrice = calculateTotalPrice(product.getProductId());
                    product.setPrice(totalPrice);
                    productRepository.save(product);
                }
            }
        }
    }

    @Override
    public void updateProductPrice(Shell shell) {
        List<Products> productList = productRepository.findAllByShellID(shell.getShellId());
        for (Products product : productList) {
            double totalPrice = calculateTotalPrice(product.getProductId());
            product.setPrice(totalPrice);
            productRepository.save(product);
        }
    }

    @Override
    public Page<ProductDTO> getAllProductByCategory(int categoryId, Pageable pageable) {
        return productRepository.findAllByCategoryCategoryId(categoryId, pageable).map(productMapper::mapProductToDTO);
    }

    @Override
    public Page<ProductDTO> getProductsSortedByName(String direction, Pageable pageable) {
        Page<Products> productsPage = direction.equalsIgnoreCase("desc") ? productRepository.findAllByOrderByProductNameDesc(pageable) : productRepository.findAllByOrderByProductNameAsc(pageable);
        return productsPage.map(productMapper::mapProductToDTO);
    }

    @Override
    public Page<ProductDTO> getProductsSortedByStockQuantity(String direction, Pageable pageable) {
        Page<Products> productsPage = direction.equalsIgnoreCase("desc") ? productRepository.findAllByOrderByStockQuantityDesc(pageable) : productRepository.findAllByOrderByStockQuantityAsc(pageable);
        return productsPage.map(productMapper::mapProductToDTO);
    }

    @Override
    public Page<ProductDTO> getProductsByNameKeyword(String keyword, Pageable pageable) {
        return productRepository.findByProductNameContainingIgnoreCase(keyword, pageable).map(productMapper::mapProductToDTO);
    }

    @Override
    public Page<ProductDTO> getProductsByPriceRange(double minPrice, double maxPrice, String direction, Pageable pageable) {
        Page<Products> productsPage = direction.equalsIgnoreCase("desc") ? productRepository.findByPriceBetweenOrderByPriceDesc(minPrice, maxPrice, pageable) : productRepository.findByPriceBetweenOrderByPriceAsc(minPrice, maxPrice, pageable);
        return productsPage.map(productMapper::mapProductToDTO);
    }

    @Override
    public Page<ProductDTO> getProductsByCategorySortedByPrice(String categoryName, String direction, Pageable pageable) {
        Page<Products> productsPage = direction.equalsIgnoreCase("desc") ? productRepository.findByCategoryOrderByPriceDesc(categoryName, pageable) : productRepository.findByCategoryOrderByPriceAsc(categoryName, pageable);
        return productsPage.map(productMapper::mapProductToDTO);
    }

    @Override
    public Page<ProductDTO> getProductsByMultipleCriteria(String categoryName, String collection, Double minPrice, Double maxPrice, Pageable pageable) {
        return productRepository.findProductsByMultipleCriteria(categoryName, collection, minPrice, maxPrice, pageable).map(productMapper::mapProductToDTO);
    }

    // Use to update quantity of product after insert database
    @Override
    public void resetAllStockQuantity() {
        List<Products> products = productRepository.findAll();
        List<Diamond> diamonds;
        for (Products product : products) {
            diamonds = diamondsRepository.findDiamondsByProductId(product.getProductId());
            product.setStockQuantity(diamonds.size());
            productRepository.save(product);
        }
    }

    @Override
    public void updateProductQuantity(int id) {
        List<Diamond> diamonds = diamondsRepository.findDiamondsByProductId(id);
        Products products = productRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Can not found product"));
        products.setStockQuantity(diamonds.size());
        productRepository.save(products);
    }

    // Use to update diamond set of product after insert database
    @Override
    public void updateProductDiamondSet() {
        List<Products> products = productRepository.findAll();
        Set<Diamond> diamonds;
        for (Products product : products) {
            diamonds = new HashSet<>(diamondsRepository.findDiamondsByProductId(product.getProductId()));
            product.setDiamonds(diamonds);
            System.out.println(product.getProductId() + ": " + diamonds.size());
            productRepository.save(product);
        }

    }


    public void updateProductPricesOnStartup() {
        List<Products> products = productRepository.findAll();
        for (Products product : products) {
            double totalPrice = calculateTotalPrice(product.getProductId());
            product.setPrice(totalPrice);
            productRepository.save(product);
        }
    }

    @Override
    @Transactional
    public void updateQuantityPay(int orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("cannot find order"));
        List<OrderDetails> orderDetails = order.getOrderDetails();
        for (OrderDetails od : orderDetails) {
            Products p = od.getProduct();
            Products setQuantity = productRepository.findById(p.getProductId()).orElseThrow(() -> new IllegalArgumentException("cannot get product!!!"));
            setQuantity.setStockQuantity(0);
            productRepository.save(setQuantity);
            for (Diamond d : od.getProduct().getDiamonds()) {
                Diamond diamond = diamondsRepository.findById(d.getDiamondId()).orElseThrow(() -> new IllegalArgumentException("no diamond found"));
                diamond.setStatus(false);
                diamondsRepository.save(diamond);
            }
        }
    }
}
