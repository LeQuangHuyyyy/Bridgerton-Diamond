package org.example.diamondshopsystem.services.imp;

import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;

import java.util.List;

public interface UserServiceImp {
    Page<UserDTO> getAllUsers(Pageable pageable);

    UserDTO getUserById(int id);

    UserDTO createUser(UserDTO userDTO);

    UserDTO updateUser(int id, UserDTO userDTO);

    void deleteUser(int id);

    UserDTO getUserByEmail(String email);

    UserDTO getUserByUsername(String username);

        List<UserDTO> getUserByKeyWord(String keyWord);
}
