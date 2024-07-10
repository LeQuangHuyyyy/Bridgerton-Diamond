package org.example.diamondshopsystem.services;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.repositories.UserRepository;
import org.example.diamondshopsystem.services.Map.UserMapper;
import org.example.diamondshopsystem.services.imp.AccountService;
import org.example.diamondshopsystem.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountServiceImp implements AccountService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserMapper userMapper;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    RegistrationService registrationService;
    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    @Override
    public boolean updateUser(UserDTO userDTO) {
        User user = userRepository.findById(userDTO.getUserid()).get();
        user.setEmail(userDTO.getEmail());
        user.setName(userDTO.getName());
        user.setAddress(userDTO.getAddress());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        try {
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public UserDTO getUserDetail(int userid) {
        User user = userRepository.findById(userid).get();
        return userMapper.mapUserToDTO(user);
    }

    @Override
    public boolean updatePassword(String oldPassword, String newPassword, int id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(oldPassword, user.getPassword())) {
                if (newPassword != null && !newPassword.trim().isEmpty()) {
                    String encodedPassword = passwordEncoder.encode(newPassword);
                    user.setPassword(encodedPassword);
                    userRepository.save(user);
                    return true;
                }
            }
        }
        return false;
    }

}
