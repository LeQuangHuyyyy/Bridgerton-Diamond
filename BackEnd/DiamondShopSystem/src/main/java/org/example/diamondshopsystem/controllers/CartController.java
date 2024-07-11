package org.example.diamondshopsystem.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.example.diamondshopsystem.dto.*;
import org.example.diamondshopsystem.entities.DiscountCodes;
import org.example.diamondshopsystem.entities.Order;
import org.example.diamondshopsystem.entities.Products;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.payload.requests.*;
import org.example.diamondshopsystem.repositories.ProductRepository;
import org.example.diamondshopsystem.repositories.UserRepository;
import org.example.diamondshopsystem.services.PaymentService;
import org.example.diamondshopsystem.services.ShoppingCartService;
import org.example.diamondshopsystem.services.UserService;
import org.example.diamondshopsystem.services.imp.DiamondServiceImp;
import org.example.diamondshopsystem.services.imp.DiscountCodeServiceImp;
import org.example.diamondshopsystem.utils.CookieUtil;
import org.example.diamondshopsystem.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    ShoppingCartService shoppingCartService;

    @Autowired
    UserService userService;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PaymentService paymentService;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    DiscountCodeServiceImp discountCodeServiceImp;

    @Autowired
    DiamondServiceImp diamondServiceImp;

    @PostMapping("/add")
    public ResponseEntity<?> addProductToCart(@RequestBody AddProductRequest addProductRequest, HttpServletResponse response) {
        //product
        Products product = productRepository.findById(addProductRequest.getProductId()).orElseThrow(() -> new IllegalArgumentException("Product not found"));

        //size
        Integer sizeId = addProductRequest.getSizeId();
        if (sizeId == null) {
            return ResponseEntity.badRequest().body("Size must be selected for the product.");
        }

        try {
            shoppingCartService.addProduct(product, addProductRequest.getQuantity(), sizeId);
            //them no vao gio
            List<CartDTO> cartItem = shoppingCartService.getProductsInCart();
            //save vao cookie
            CookieUtil.saveCartToCookies(response, cartItem);//luu y

            return ResponseEntity.ok("Product added to cart successfully.");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding product to cart.");
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeProductFromCart(@RequestBody RemoveProductRequest removeProductRequest, HttpServletResponse response) {
        Products product = new Products();
        product.setProductId(removeProductRequest.getProductId());

        try {
            shoppingCartService.removeProduct(product);
            List<CartDTO> cartItems = shoppingCartService.getProductsInCart();
            CookieUtil.saveCartToCookies(response, cartItems);
            return ResponseEntity.ok("Product removed from cart successfully.");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while removing product from cart.");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProductInCart(@RequestBody UpdateProductRequest updateProductRequest, HttpServletResponse response) {
        Products product = new Products();
        product.setProductId(updateProductRequest.getProductId());
        try {
            shoppingCartService.updateProductQuantity(product, updateProductRequest.getQuantity());
            List<CartDTO> cartItems = shoppingCartService.getProductsInCart();
            CookieUtil.saveCartToCookies(response, cartItems);
            return ResponseEntity.ok("Product quantity updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating product quantity.");
        }
    }

    //get theo list
    @PostMapping("/cart")
    public ResponseEntity<?> transferAddRequestToCart(@RequestBody List<AddProductRequest> addProductRequests, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        ResponseData responseData = new ResponseData();
        responseData.setData(shoppingCartService.getCartDTOByProductRequest(addProductRequests, pageable));
        responseData.setDescription("ke ke ke");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    //get theo cookie
    @GetMapping()
    public List<CartDTO> getCartDetails(HttpServletRequest request) {
        List<CartDTO> cart = CookieUtil.getCartFromCookies(request);
        return cart;
    }

    // address -> jwtDecode(token) as ....

    //order request (id user , amount, List addProduct request,  thay đôổi order thêm taxt, ) -> peding -> comfirm ->


    // pedding
    @Transactional
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest checkoutRequest, @RequestHeader("Authorization") String authHeader, HttpServletResponse response) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.verifyToken(token)) {

                String email = jwtUtil.getUsernameFromToken(token);
                UserDTO userDTO = userService.getUserByEmail(email);

                if (userDTO != null) {
                    OrderDTO orderDTO = new OrderDTO();
                    try {
                        double dis = 0;
                        String code = checkoutRequest.getCode();
                        if (!code.isBlank()) {
                            code = code.trim();
                            dis = discountCodeServiceImp.useDiscountCode(code);
                        }
                        Order order = shoppingCartService.checkout(orderDTO, userDTO, checkoutRequest.getDeliveryAddress(), dis);
                        CookieUtil.clearCartFromCookies(response);
                        return ResponseEntity.ok(Map.of("message", "Checkout successful.", "orderId", order.getOrderId()));
                    } catch (NullPointerException e) {
                        return ResponseEntity.badRequest().body("Can not found discount code.");
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during checkout.");
                    }
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token.");
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        return ResponseEntity.ok(shoppingCartService.creteOrder(orderRequest));
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalPrice() {
        return ResponseEntity.ok(shoppingCartService.getTotalPrice());
    }

    @GetMapping("/clearcart")
    public ResponseEntity<?> clearCart(HttpServletResponse response) {
        CookieUtil.clearCartFromCookies(response);
        return ResponseEntity.ok("Cart cleared successfully.");
    }

    @GetMapping("/get-discount")
    public ResponseEntity<?> getDiscountByCode(String code) {
        try {
            double discount = discountCodeServiceImp.getDiscountCodePercentage(code);
            return ResponseEntity.ok(discount);
        } catch (NullPointerException e) {
            return ResponseEntity.badRequest().body("Invalid discount code.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}