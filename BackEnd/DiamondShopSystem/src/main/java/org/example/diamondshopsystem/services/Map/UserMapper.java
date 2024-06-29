package org.example.diamondshopsystem.services.Map;

import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO mapUserToDTO(User user) {
        if (user == null) {
            return null;
        }
        UserDTO userDTO = new UserDTO();
        userDTO.setUserid(user.getUserid());
        userDTO.setName(user.getName());
        userDTO.setPassword(user.getPassword());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setEmail(user.getEmail());
        userDTO.setAddress(user.getAddress());
        userDTO.setAccumulatedPoints(user.getAccumulatedPoints());
        userDTO.setRole(user.getRole());
        userDTO.setStatus(user.isStatus());
        return userDTO;
    }

    public User mapUserDTOToUser(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        }
        User user = new User();
        user.setName(userDTO.getName());
        user.setPassword(userDTO.getPassword());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setEmail(userDTO.getEmail());
        user.setAddress(userDTO.getAddress());
        user.setAccumulatedPoints(userDTO.getAccumulatedPoints());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.isStatus());
        return user;
    }

    public void mapUserDTOtoUser(UserDTO userDTO, User user) {
        if (userDTO == null || user == null) {
            return;
        }
        user.setName(userDTO.getName());
        user.setPassword(userDTO.getPassword());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setEmail(userDTO.getEmail());
        user.setAddress(userDTO.getAddress());
        user.setAccumulatedPoints(userDTO.getAccumulatedPoints());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.isStatus());
    }
}
