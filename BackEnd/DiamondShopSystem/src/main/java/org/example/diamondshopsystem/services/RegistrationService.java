package org.example.diamondshopsystem.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.diamondshopsystem.dto.DiamondDTO;
import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.dto.WarrantyDTO;
import org.example.diamondshopsystem.entities.Role;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.payload.requests.ContactRequest;
import org.example.diamondshopsystem.payload.requests.SignupRequest;
import org.example.diamondshopsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RegistrationService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Map<String, UserDTO> temporaryUserStorage = new ConcurrentHashMap<>();
    private final Map<String, UserDTO> checkDiscountCodeSend = new ConcurrentHashMap<>();


    public void sendVerificationCode(SignupRequest signupRequest) throws MessagingException {
        String verificationCode = generateVerificationCode();

        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(signupRequest.getEmail());
        userDTO.setPassword(signupRequest.getPassword());
        userDTO.setName(signupRequest.getName());
        userDTO.setPhoneNumber(signupRequest.getPhoneNumber());
        userDTO.setAddress(signupRequest.getAddress());

        userDTO.setRole(Role.CUSTOMER);  // Đặt role là CUSTOMER
        userDTO.setStatus(true);         // Đặt status là true
        userDTO.setVerificationCode(verificationCode);
        userDTO.setExpirationTime(LocalDateTime.now().plusMinutes(15));

        // Store UserDTO in temporary storage
        temporaryUserStorage.put(userDTO.getEmail(), userDTO);

        sendVerificationCodeToEmail(signupRequest.getEmail(), verificationCode);
    }

    public void checkDiscountCodeSend(String email) throws MessagingException {
        if (checkDiscountCodeSend.containsKey(email)) {
            sendNoticeEmail(email);
            checkDiscountCodeSend.clear();
        }
    }

    public boolean verifyRegistration(String email, String verificationCode) {
        UserDTO userDTO = getUserDTOByEmail(email);

        if (userDTO == null || userDTO.getExpirationTime().isBefore(LocalDateTime.now()) || !userDTO.getVerificationCode().equals(verificationCode)) {
            return false;
        }

        // Register the new user
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setName(userDTO.getName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setAddress(userDTO.getAddress());
        user.setAccumulatedPoints(userDTO.getAccumulatedPoints());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.isStatus());
        userRepository.save(user);
        checkDiscountCodeSend.put(userDTO.getEmail(), userDTO);
        // Remove UserDTO from temporary storage
        temporaryUserStorage.remove(email);

        return true;
    }


    private String generateVerificationCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    public void sendNoticeEmail(String email) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(email);
        helper.setSubject("Welcome to Bridgerton");
        String htmlTemplate = readHtmlTemplate("senDiscountCode.html");
        helper.setText(htmlTemplate, true);

        mailSender.send(message);
    }

    public void sendWarrantiesToEmail(String email, WarrantyDTO warrantyDTO) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(email);
        helper.setSubject("Warranties From Bridgerton Diamond");

        String htmlTemplate = readHtmlTemplate("warranties.html");

        htmlTemplate = htmlTemplate.replace("${warrantiesCode}", String.valueOf(warrantyDTO.getWarrantyCode())).replace("${warrantyStartDate}", warrantyDTO.getWarrantyStartDate().toString().substring(0, 10)).replace("${warrantyExpirationDate}", warrantyDTO.getWarrantyExpirationDate().toString().substring(0, 10)).replace("${orderId}", String.valueOf(warrantyDTO.getOrderId())).replace("${productId}", String.valueOf(warrantyDTO.getProductId())).replace("${productName}", warrantyDTO.getProductName());

        if (warrantyDTO.getDiamondDto() != null && !warrantyDTO.getDiamondDto().isEmpty()) {
            DiamondDTO diamond = warrantyDTO.getDiamondDto().get(0);
            htmlTemplate = htmlTemplate.replace("${carat}", String.valueOf(diamond.getCarat())).replace("${price}", String.valueOf(diamond.getPrice())).replace("${cut}", diamond.getCut()).replace("${color}", diamond.getColor()).replace("${clarity}", diamond.getClarity());
        } else {
            htmlTemplate = htmlTemplate.replace("${carat}", "").replace("${price}", "").replace("${cut}", "").replace("${color}", "").replace("${clarity}", "");
        }

        helper.setText(htmlTemplate, true);
        mailSender.send(message);
    }

    public void sendContactToManager(ContactRequest contactRequest) throws MessagingException {
        if (contactRequest == null) {
            throw new IllegalArgumentException("ContactRequest must not be null");
        }

        if (contactRequest.getEmail() == null || contactRequest.getName() == null || contactRequest.getMessage() == null) {
            throw new IllegalArgumentException("ContactRequest fields must not be null");
        }

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo("lequanghuy45159@gmail.com");

        helper.setSubject(contactRequest.getSubject());

        String htmlTemplate = readHtmlTemplate("contactFromCustomer.html");

        htmlTemplate = htmlTemplate.replace("${email}", contactRequest.getEmail());
        htmlTemplate = htmlTemplate.replace("${name}", contactRequest.getName());
        htmlTemplate = htmlTemplate.replace("${message}", contactRequest.getMessage());

        helper.setText(htmlTemplate, true);

        mailSender.send(message);
    }


    public void sendVerificationCodeToEmail(String email, String verificationCode) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(email);
        helper.setSubject("Verification Code");

        String htmlTemplate = readHtmlTemplate("sendEmail.html");

        String emailContent = htmlTemplate.replace("${verificationCode}", verificationCode);

        helper.setText(emailContent, true);

        mailSender.send(message);
    }

    private String readHtmlTemplate(String templateName) {
        try {
            return new String(this.getClass().getClassLoader().getResourceAsStream("templates/" + templateName).readAllBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }

    private UserDTO getUserDTOByEmail(String email) {
        return temporaryUserStorage.get(email);
    }

    public void sendResetPasswordVerificationCode(String email) throws MessagingException {
        String verificationCode = generateVerificationCode();

        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(email);

        userDTO.setVerificationCode(verificationCode);
        userDTO.setExpirationTime(LocalDateTime.now().plusMinutes(15));

        // Store UserDTO in temporary storage
        temporaryUserStorage.put(userDTO.getEmail(), userDTO);

        sendVerificationCodeToEmail(email, verificationCode);
    }

    public boolean verifyResetPassword(String email, String verificationCode, String password) {
        UserDTO userDTO = getUserDTOByEmail(email);

        if (userDTO == null || userDTO.getExpirationTime().isBefore(LocalDateTime.now()) || !userDTO.getVerificationCode().equals(verificationCode)) {
            return false;
        }

        // Register the new user
        User user = userRepository.findByEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        // Remove UserDTO from temporary storage
        temporaryUserStorage.remove(email);

        return true;
    }
}