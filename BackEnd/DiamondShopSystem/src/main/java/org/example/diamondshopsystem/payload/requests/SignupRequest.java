package org.example.diamondshopsystem.payload.requests;

import lombok.Getter;
import lombok.Setter;
import org.example.diamondshopsystem.entities.Role;

@Getter
@Setter
public class SignupRequest {
    private String name;
    private String password;
    private String phoneNumber;
    private String email;
    private String address;
    private Role role ;
    private boolean status = true;
}