package org.example.diamondshopsystem.dto;

import lombok.Getter;
import lombok.Setter;
import org.example.diamondshopsystem.entities.Role;

import java.time.LocalDateTime;

@Getter
@Setter

public class UserDTO {
    private int userid;
    private String name;
    private String password;
    private String phoneNumber;
    private String email;
    private String address;
    private int accumulatedPoints;
    private Role role ;
    private boolean status;

    private String verificationCode;
    private LocalDateTime expirationTime;
}
