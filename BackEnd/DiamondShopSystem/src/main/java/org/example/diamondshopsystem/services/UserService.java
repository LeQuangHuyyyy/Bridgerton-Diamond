package org.example.diamondshopsystem.services;

import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.repositories.UserRepository;
import org.example.diamondshopsystem.services.Map.UserMapper;
import org.example.diamondshopsystem.services.imp.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserServiceImp {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    private final UserMapper userMapper = new UserMapper();

    @Override
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::mapUserToDTO);
    }

    ;

    @Override
    public UserDTO getUserById(int id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return userMapper.mapUserToDTO(user);
        }
        return null;
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User user = userMapper.mapUserDTOToUser(userDTO);
        // Mã hóa mật khẩu trước khi lưu
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        User savedUser = userRepository.save(user);
        return userMapper.mapUserToDTO(savedUser);
    }

    @Override
    public UserDTO updateUser(int id, UserDTO userDTO) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            userMapper.mapUserDTOtoUser(userDTO, user);
            // Kiểm tra null trước khi so sánh mật khẩu
            if (userDTO.getPassword() != null && !userDTO.getPassword().equals(user.getPassword())) {
                String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
                user.setPassword(encodedPassword);
            }
            User updatedUser = userRepository.save(user);
            return userMapper.mapUserToDTO(updatedUser);
        }
        return null;
    }

    @Override
    public void deleteUser(int id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setStatus(false);
            userRepository.save(user);
        }

    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return user != null ? userMapper.mapUserToDTO(user) : null;
    }

    @Override
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByName(username);
        return user != null ? userMapper.mapUserToDTO(user) : null;
    }

    @Override
    public List<UserDTO> getUserByKeyWord(String keyWord) {
        List<User> user = userRepository.getUserByKeyWord(keyWord);
        List<UserDTO> userDTOS = new ArrayList<>();
        for (User u : user) {
            userDTOS.add(userMapper.mapUserToDTO(u));
        }
        return userDTOS;
    }
}
