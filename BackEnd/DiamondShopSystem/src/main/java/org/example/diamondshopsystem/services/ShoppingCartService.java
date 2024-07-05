package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.*;
import org.example.diamondshopsystem.entities.*;
import org.example.diamondshopsystem.payload.requests.AddProductRequest;
import org.example.diamondshopsystem.payload.requests.OrderRequest;
import org.example.diamondshopsystem.repositories.*;
import org.example.diamondshopsystem.services.Map.OrderMapper;
import org.example.diamondshopsystem.services.Map.UserMapper;
import org.example.diamondshopsystem.services.exeptions.NotEnoughProductsInStockException;
import org.example.diamondshopsystem.services.imp.ShoppingCartServiceImp;
import org.example.diamondshopsystem.services.imp.WarrantiesServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Transactional
public class ShoppingCartService implements ShoppingCartServiceImp {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    SizeRepository sizeRepository;

    @Autowired
    UserMapper userMapper;

    @Autowired
    OrderMapper orderMapper;

    @Autowired
    DiscountCodeRepository discountCodeRepository;

    @Autowired
    private WarrantiesServiceImp warrantiesServiceImp;

    private final Map<Products, Integer> cart = new HashMap<>();

    private final Map<Products, Double> productSizes = new HashMap<>();

    private BigDecimal totalPrice = BigDecimal.ZERO;

    @Autowired
    private DiamondsRepository diamondsRepository;

    @Override
    public synchronized void addProduct(Products product, int quantity, Integer sizeId) {
        Products managedProduct = productRepository.findById(product.getProductId()).orElseThrow(() -> new IllegalArgumentException("Product does not exist in the inventory."));

        int stockQuantity = managedProduct.getStockQuantity();
        if (stockQuantity == 0) {
            throw new IllegalArgumentException("Product does not exist in the inventory.");
        } else if (stockQuantity < quantity) {
            throw new NotEnoughProductsInStockException("Not enough products in stock.");
        }

        // Fetch size from the database using sizeId
        Size size = sizeRepository.findById(sizeId).orElseThrow(() -> new IllegalArgumentException("Size not found"));

        cart.merge(managedProduct, quantity, Integer::sum);
        productSizes.put(managedProduct, size.getValueSize()); // Storing the size value as a Double
        totalPrice = totalPrice.add(BigDecimal.valueOf(managedProduct.getPrice()).multiply(BigDecimal.valueOf(quantity)));

        System.out.println("Added product: " + product.getProductId() + ", Quantity: " + quantity + ", Size: " + size.getValueSize() + ", New Total Price: " + totalPrice);
    }

    @Override
    public synchronized void removeProduct(Products product) {
        Products managedProduct = productRepository.findById(product.getProductId()).orElseThrow(() -> new IllegalArgumentException("Product does not exist in the inventory"));

        System.out.println(cart);
        if (cart.containsKey(managedProduct)) {
            int currentQuantity = cart.get(managedProduct);
            cart.remove(managedProduct);
            BigDecimal productTotalPrice = BigDecimal.valueOf(managedProduct.getPrice()).multiply(BigDecimal.valueOf(currentQuantity));
            totalPrice = totalPrice.subtract(productTotalPrice);

            productSizes.remove(managedProduct);
            System.out.println("Removed product: " + managedProduct.getProductId() + ", Quantity: " + currentQuantity + ", New Total Price: " + totalPrice);
        } else {
            throw new IllegalArgumentException("Product not in cart.");
        }
    }

    @Override
    public synchronized void updateProductQuantity(Products product, int newQuantity) {
        Products managedProduct = productRepository.findById(product.getProductId()).orElseThrow(() -> new IllegalArgumentException("Product does not exist in the inventory"));
        if (cart.containsKey(managedProduct)) {
            int stockQuantity = productRepository.getStockQuantityById(managedProduct.getProductId());
            if (stockQuantity < newQuantity) {
                throw new NotEnoughProductsInStockException("Not enough products in stock.");
            }

            int currentQuantity = cart.get(managedProduct);
            cart.put(managedProduct, newQuantity);
            totalPrice = totalPrice.subtract(BigDecimal.valueOf(managedProduct.getPrice()).multiply(BigDecimal.valueOf(currentQuantity))).add(BigDecimal.valueOf(managedProduct.getPrice()).multiply(BigDecimal.valueOf(newQuantity)));

            System.out.println("Updated product: " + managedProduct.getProductId() + ", Quantity: " + newQuantity + ", New Total Price: " + totalPrice);
        } else {
            throw new IllegalArgumentException("Product is not in the cart");
        }
    }

    @Override
    public synchronized List<CartDTO> getProductsInCart() {
        List<CartDTO> productsInCart = new ArrayList<>();
        for (Map.Entry<Products, Integer> entry : cart.entrySet()) {
            Products product = entry.getKey();
            int quantity = entry.getValue();
            BigDecimal totalPrice = BigDecimal.valueOf(product.getPrice()).multiply(BigDecimal.valueOf(quantity));
            Double size = productSizes.get(product);
            CartDTO cartDTO = new CartDTO();
            cartDTO.setProductId(product.getProductId());
            cartDTO.setProductName(product.getProductName());
            cartDTO.setQuantity(quantity);
            cartDTO.setTotalPrice(totalPrice);
            cartDTO.setImage1(product.getImage1());
            cartDTO.setSize(size);
            productsInCart.add(cartDTO);
        }
        return productsInCart;
    }

    @Override
    public Page<CartDTO> getCartDTOByProductRequest(List<AddProductRequest> addProductRequest, Pageable pageable) {
        List<CartDTO> carts = new ArrayList<>();
        for (AddProductRequest request : addProductRequest) {
            CartDTO cartDTO = new CartDTO();
            Products products = productRepository.findById(request.getProductId()).orElseThrow(() -> new IllegalArgumentException("Product not found"));

            cartDTO.setProductId(products.getProductId());
            cartDTO.setProductName(products.getProductName());
            cartDTO.setImage1(products.getImage1());

            cartDTO.setQuantity(request.getQuantity());
            cartDTO.setSize(sizeRepository.findById(request.getSizeId()).orElseThrow().getValueSize());
            cartDTO.setSizeId(request.getSizeId());

            cartDTO.setTotalPrice(BigDecimal.valueOf(products.getPrice()).multiply(BigDecimal.valueOf(request.getQuantity())));
            carts.add(cartDTO);
        }
        return new PageImpl<>(carts);
    }

    @Override
    public void selectProductSize(Products product, SizeDTO sizeDTO) {
        if (cart.containsKey(product)) {
            Size size = sizeRepository.findById(sizeDTO.getSizeId()).orElseThrow(() -> new IllegalArgumentException("Size not found"));
            productSizes.put(product, size.getValueSize());
        } else {
            throw new IllegalArgumentException("Product is not in the cart");
        }
    }


    @Override
    public synchronized BigDecimal getTotalPrice() {
        System.out.println("Getting Total Price: " + totalPrice);
        return totalPrice;
    }

    @Transactional
    @Override
    public synchronized Order checkout(OrderDTO orderDTO, UserDTO customer, String address, double discount) {
        // Convert UserDTO to User
        User user = userMapper.mapUserDTOToUser(customer);

        // Check if the user exists in the database
        User managedUser = userRepository.findByEmail(user.getEmail());
        if (managedUser == null) {
            throw new IllegalArgumentException("User does not exist in the database.");
        }

        Order order = orderMapper.mapOrderDTOToOrder(orderDTO, managedUser);

        order.setOrderDeliveryAddress(address);

        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        Date vnpCreateDate = calendar.getTime();
        order.setOrderDate(vnpCreateDate);

        double priceAfter = totalPrice.doubleValue() - totalPrice.doubleValue() * discount / 100;
        order.setOrderTotalAmount(priceAfter);    //o day ne
        order.setStatus(OrderStatus.PENDING);
        order = orderRepository.save(order);


        // Create OrderDetails from products in the cart
        for (Map.Entry<Products, Integer> entry : cart.entrySet()) {
            Products product = entry.getKey();
            int quantity = entry.getValue();
            Double size = productSizes.get(product);

            // Check if the product exists in the database
            Products managedProduct = productRepository.findById(product.getProductId()).orElseThrow(() -> new IllegalArgumentException("Product does not exist in the inventory."));

            int stockQuantity = managedProduct.getStockQuantity();
            if (stockQuantity < quantity) {
                throw new NotEnoughProductsInStockException("Not enough products in stock.");
            }

            //Update the stock quantity
            managedProduct.setStockQuantity(stockQuantity - quantity);
            productRepository.save(managedProduct);

            //set lai status diamond
            Diamond diamondOfProduct = diamondsRepository.findFirstAvailableDiamondByProductId(managedProduct.getProductId());
            if (diamondOfProduct == null) {
                throw new IllegalArgumentException("Diamond does not exist in the inventory.");
            } else {
                diamondOfProduct.setStatus(false);
                diamondsRepository.save(diamondOfProduct);
            }
            // Create OrderDetailDTO
            OrderDetailDTO orderDetailDTO = new OrderDetailDTO();

            orderDetailDTO.setOrderId(order.getOrderId());
            orderDetailDTO.setProductId(managedProduct.getProductId());
            orderDetailDTO.setQuantity(quantity);
            orderDetailDTO.setPrice(product.getPrice());
            orderDetailDTO.setSize(size); // Updated to use size as double

            OrderDetails orderDetails = orderMapper.mapOrderDetailDTOToOrderDetail(orderDetailDTO, order, managedProduct);
            orderDetailRepository.save(orderDetails);
        }
        cart.clear();
        productSizes.clear();
        totalPrice = BigDecimal.ZERO;
        System.out.println("Checkout completed, cart cleared. New Total Price: " + totalPrice);
        return order;
    }

    @Override
    public Order creteOrder(OrderRequest orderRequest) {
        Order order = new Order();
        User user = userRepository.findById(orderRequest.getUserId()).orElseThrow(() -> new IllegalArgumentException("who is this, cannot load user  ???"));
        DiscountCodes discountCodes = discountCodeRepository.findByCode(orderRequest.getDiscountCode());

        order.setOrderDate(new Date());
        order.setOrderTotalAmount(orderRequest.getAmount());
        order.setOrderDeliveryAddress(orderRequest.getAddressOrder());
        order.setStatus(OrderStatus.PENDING);
        order.setDiscountCode(discountCodes);
        order.setCustomer(user);

        order = orderRepository.save(order);


        for (AddProductRequest o : orderRequest.getAddProductRequestList()) {
            Products products = productRepository.findById(o.getProductId()).orElseThrow(() -> new IllegalArgumentException("Product does not exist in the inventory."));
            Size size = sizeRepository.findById(o.getSizeId()).orElseThrow(() -> new IllegalArgumentException("cc, làm cc gì có cái size như này ????"));

            int stockQuantity = products.getStockQuantity();
            if (stockQuantity < o.getQuantity()) {
                throw new NotEnoughProductsInStockException("Not enough products in stock.");
            } else {
                products.setStockQuantity(stockQuantity - o.getQuantity());
                productRepository.save(products);
            }

            OrderDetailDTO orderDetailDTO = new OrderDetailDTO();
            orderDetailDTO.setOrderId(order.getOrderId());
            orderDetailDTO.setProductId(products.getProductId());
            orderDetailDTO.setQuantity(o.getQuantity());
            orderDetailDTO.setSize(size.getValueSize());

            OrderDetails orderDetails = orderMapper.mapOrderDetailDTOToOrderDetail(orderDetailDTO, order, products);
            orderDetailRepository.save(orderDetails);

            warrantiesServiceImp.createWarranties(o.getProductId(), order.getOrderId());

        }

        return order;
    }
}
