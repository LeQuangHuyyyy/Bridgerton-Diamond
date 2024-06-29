package org.example.diamondshopsystem.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.diamondshopsystem.dto.CartDTO;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.Base64;
import java.util.List;

@Component
public class CookieUtil {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final int COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

    public static void saveCartToCookies(HttpServletResponse response, List<CartDTO> cartItems) {
        try {
            String json = objectMapper.writeValueAsString(cartItems);
            String encodedCart = Base64.getEncoder().encodeToString(json.getBytes());

            Cookie cartCookie = new Cookie("cart", encodedCart);
            cartCookie.setPath("/");
            cartCookie.setHttpOnly(true); // Set HttpOnly to true for security
            cartCookie.setSecure(false); // Set to true if using HTTPS
            cartCookie.setMaxAge(COOKIE_MAX_AGE_SECONDS);
            response.addCookie(cartCookie);

            System.out.println("Saved cart to cookie:");
            System.out.println(cartCookie.getName() + " : " + cartCookie.getValue());

        } catch (IOException e) {
            System.err.println("Error encoding cart items to JSON: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static List<CartDTO> getCartFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        System.out.println(request.getCookies());
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("cart".equals(cookie.getName())) {
                    try {
                        String decodedCart = new String(Base64.getDecoder().decode(cookie.getValue()));
                        List<CartDTO> cartDTOS = objectMapper.readValue(decodedCart, new TypeReference<List<CartDTO>>() {});

                        System.out.println("Decoded cart from cookie:");
                        System.out.println(cookie.getName() + " : " + decodedCart);

                        return cartDTOS;
                    } catch (IOException e) {
                        System.err.println("Error decoding cart cookie: " + e.getMessage());
                        e.printStackTrace();
                        return Collections.emptyList(); // Return empty list or handle differently based on your requirement
                    }
                }
            }
        }
        return Collections.emptyList();
    }

    public static void clearCartFromCookies(HttpServletResponse response) {
        Cookie cartCookie = new Cookie("cart", null);
        cartCookie.setPath("/");
        cartCookie.setMaxAge(0);
        response.addCookie(cartCookie);

        System.out.println("Cleared cart cookie.");
    }
}
