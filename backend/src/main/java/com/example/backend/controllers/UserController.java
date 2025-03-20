package com.example.backend.controllers;

import com.example.backend.dto.LoginRequest;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody User user) {
        String response = userService.register(user);
        if (response.equals("Đăng ký thành công!")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    // @PostMapping("/login")
    // public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
    //     String response = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
    //     if (response.equals("Đăng nhập thành công!")) {
    //         return ResponseEntity.ok(response);
    //     }
    //     return ResponseEntity.status(401).body(response);
    // }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Received login request from: " + loginRequest.getUsername());

        Map<String, Object> response = userService.login(loginRequest.getUsername(), loginRequest.getPassword());

        if (response.containsKey("error")) {
            return ResponseEntity.status(401).body(response);
        }

        return ResponseEntity.ok(response);
    }
}
