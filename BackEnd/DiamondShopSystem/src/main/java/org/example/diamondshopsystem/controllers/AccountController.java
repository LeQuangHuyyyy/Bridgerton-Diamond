package org.example.diamondshopsystem.controllers;


import jakarta.mail.MessagingException;
import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.payload.ResponseData;
import org.example.diamondshopsystem.services.imp.AccountService;
import org.example.diamondshopsystem.services.imp.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/myAccount")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    AccountService accountService;

    @PostMapping("")
    public ResponseEntity<?> getAccount(@RequestParam int userId) {
        ResponseData responseData = new ResponseData();
        responseData.setData(accountService.getUserDetail(userId));
        responseData.setDescription("lấy user nhá, lấy k dc thì chắc là sai á !!!!");
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PutMapping("updateAccount")
    public ResponseEntity<?> updateAccount(@RequestBody UserDTO userDTO) throws MessagingException {
        ResponseData responseData = new ResponseData();
        if (accountService.updateUser(userDTO)) {
            responseData.setDescription("update oke nhá ");
            return new ResponseEntity<>(responseData, HttpStatus.ACCEPTED);
        } else {
            responseData.setDescription("update lỗi rồi, tôi ngu wa :((");
            return new ResponseEntity<>(responseData, HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestParam int userid, @RequestParam String oldPassword, @RequestParam String newPassword) throws MessagingException {
        ResponseData responseData = new ResponseData();
        if (accountService.updatePassword(oldPassword, newPassword, userid)) {
            responseData.setDescription("update oke nhá ");
            return new ResponseEntity<>(responseData, HttpStatus.ACCEPTED);
        } else {
            responseData.setDescription("update lỗi rồi, tôi ngu wa :((");
            return new ResponseEntity<>(responseData, HttpStatus.FORBIDDEN);
        }
    }
}
