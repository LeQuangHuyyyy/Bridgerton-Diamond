package org.example.diamondshopsystem.controllers;

import jakarta.mail.MessagingException;
import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.payload.requests.EmailRequest;
import org.example.diamondshopsystem.repositories.UserRepository;
import org.example.diamondshopsystem.services.Map.UserMapper;
import org.example.diamondshopsystem.services.RegistrationService;
import org.example.diamondshopsystem.services.imp.UserServiceImp;
import org.example.diamondshopsystem.utils.JwtUtil;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.payload.requests.SignupRequest;
import org.example.diamondshopsystem.services.imp.LoginServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    LoginServiceImp loginServiceImp;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    RegistrationService registrationService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserServiceImp userServiceImp;
    @Autowired
    private UserMapper userMapper;

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestParam String email, @RequestParam String password) throws MessagingException {
        ResponseData responseData = new ResponseData();
        User user = loginServiceImp.checkLogin(email, password);
        if (user != null) {
            UserDTO userDTO = userMapper.mapUserToDTO(user);
            String token = jwtUtil.generateToken(userDTO);
            responseData.setData(token);
            registrationService.checkDiscountCodeSend(email);
        } else {
            responseData.setStatus(404);
            responseData.setData(false);
            responseData.setSuccess(false);
        }
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) throws MessagingException, IOException {
        ResponseData responseData = new ResponseData();

        if (userRepository.findByEmail(signupRequest.getEmail()) != null) {
            responseData.setData(false);
            responseData.setSuccess(false);
            responseData.setDescription("Email already exists.");
            return new ResponseEntity<>(responseData, HttpStatus.CONFLICT);
        } else {

            registrationService.sendVerificationCode(signupRequest);

            responseData.setData(true);
            responseData.setDescription("Verification code sent to your email.");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<?> verifyRegistration(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String verificationCode = requestBody.get("verificationCode");

        ResponseData responseData = new ResponseData();

        if (email == null || verificationCode == null) {
            responseData.setData(false);
            responseData.setSuccess(false);
            responseData.setDescription("Email and verification code are required.");
            return new ResponseEntity<>(responseData, HttpStatus.CONFLICT);
        }

        boolean isVerified = registrationService.verifyRegistration(email, verificationCode);

        if (isVerified) {
            responseData.setData(true);
            responseData.setDescription("Registration successful.");
        } else {
            responseData.setData(false);
            responseData.setSuccess(false);
            responseData.setDescription("Invalid or expired verification code.");
        }

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/forgotpassword")
    public ResponseEntity<?> getpassword(@RequestBody EmailRequest emailRequest) throws MessagingException {
        ResponseData responseData = new ResponseData();

        if (userRepository.findByEmail(emailRequest.getEmail()) != null) {
            registrationService.sendResetPasswordVerificationCode(emailRequest.getEmail());

            responseData.setData(true);
            responseData.setDescription("Verification code sent to your email.");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } else {
            responseData.setData(false);
            responseData.setSuccess(false);
            responseData.setDescription("Email does not exist.");
            return new ResponseEntity<>(responseData, HttpStatus.CONFLICT);
        }
    }


    @PostMapping("/resetpassword")
    public ResponseEntity<?> verifyResetPassword(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String verificationCode = requestBody.get("verificationCode");
        String password = requestBody.get("password");
        ResponseData responseData = new ResponseData();

        if (email == null || verificationCode == null || password == null) {
            responseData.setData(false);
            responseData.setSuccess(false);
            responseData.setDescription("Email, new password and verification code are required.");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }

        boolean isVerified = registrationService.verifyResetPassword(email, verificationCode, password);

        if (isVerified) {
            responseData.setData(true);
            responseData.setDescription("Reset password successful.");
        } else {
            responseData.setData(false);
            responseData.setSuccess(false);
            responseData.setDescription("Invalid or expired verification code.");
        }

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}