package org.example.diamondshopsystem.controllers;


import org.example.diamondshopsystem.dto.UserDTO;
import org.example.diamondshopsystem.entities.User;
import org.example.diamondshopsystem.services.imp.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/manage")
@CrossOrigin(origins = "*")

public class AdminController {

    @Autowired
    UserServiceImp userServiceImp;

    @GetMapping("/accounts")
    public ResponseEntity<Page<UserDTO>> getAllUser(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<UserDTO> users = userServiceImp.getAllUsers(pageable);
        if (users.hasContent()) {
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.noContent().build();
        }
    }


    @GetMapping("/accounts/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable int id) {
        UserDTO user = userServiceImp.getUserById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.FOUND);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/accounts")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO user) throws ParseException {
        userServiceImp.createUser(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/accounts/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable int id, @RequestBody UserDTO user) {
        userServiceImp.updateUser(id, user);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<UserDTO> deleteUser(@PathVariable int id) {
        userServiceImp.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/searchAccount")
    public ResponseEntity<?> getUserByEmail(@RequestParam("keyword") String keyWord) {
        List<UserDTO> userDTO = userServiceImp.getUserByKeyWord(keyWord);
        if (userDTO != null) {
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}