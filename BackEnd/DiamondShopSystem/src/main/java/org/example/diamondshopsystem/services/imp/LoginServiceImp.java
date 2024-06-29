package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.payload.requests.SignupRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface LoginServiceImp {
    List<UserDTO> getAllUser();

    User checkLogin(String email, String password);
}
