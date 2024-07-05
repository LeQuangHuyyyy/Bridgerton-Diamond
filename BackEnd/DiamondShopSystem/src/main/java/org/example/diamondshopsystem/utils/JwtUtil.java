package org.example.diamondshopsystem.utils;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;


@Component
public class JwtUtil {

    @Value("${jwt.privateKey}")
    private String privateKey;


    public String generateToken(UserDTO userDTO) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
        String jwt = Jwts.builder()
                .setSubject(userDTO.getEmail())
                .claim("id", userDTO.getUserid())
                .claim("name", userDTO.getName())
                .claim("role", userDTO.getRole().toString())
                .claim("phone", userDTO.getPhoneNumber())
                .claim("address", userDTO.getAddress())
                .claim("email", userDTO.getEmail())
                .signWith(key)
                .compact();

        return jwt;
    }

    public boolean verifyToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
            Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key).build().parseClaimsJws(token);
        Claims claims = claimsJws.getBody();
        return claims.getSubject();
    }

//    public Role getRoleFromToken(String token) {
//        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
//        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key).build().parseClaimsJws(token);
//        Claims claims = claimsJws.getBody();
//        return claims.get("role", Role.class);
//    }
//
//    public int getIdFromToken(String token) {
//        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
//        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key).build().parseClaimsJws(token);
//        Claims claims = claimsJws.getBody();
//        return claims.get("id", Integer.class);
//    }
}
