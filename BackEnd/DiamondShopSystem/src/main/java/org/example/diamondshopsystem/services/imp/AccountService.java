package org.example.diamondshopsystem.services.imp;

import jakarta.mail.MessagingException;
import org.example.diamondshopsystem.dto.UserDTO;

public interface AccountService {
    UserDTO getUserDetail(int userid);

    boolean updateUser(UserDTO userDTO) throws MessagingException;

    boolean updatePassword(String oldPassword, String newPassword, int id);
}
