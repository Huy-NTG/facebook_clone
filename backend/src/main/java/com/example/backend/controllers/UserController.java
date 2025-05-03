package com.example.backend.controllers;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.UserRegisterDTO;
import com.example.backend.dto.UserUpdateDTO;
// import com.example.backend.model.User;
import com.example.backend.service.UserService;
// import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private UserService userService;
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegisterDTO dto) {
        String response = userService.register(dto);
        if (response.equals("Đăng ký thành công!")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Received login request from: " + loginRequest.getEmail());
        Map<String, Object> response = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (response.containsKey("error")) {
            return ResponseEntity.status(401).body(response);
        }
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping(value = "/update", consumes = "multipart/form-data")
    public ResponseEntity<String> updateUser(
        @RequestPart("user") UserUpdateDTO dto,
        @RequestPart(value = "avatarFile", required = false) MultipartFile avatarFile) {

        dto.setAvatarFile(avatarFile); // gán file vào DTO
        String result = userService.updateUser(dto);
        if (result.equals("Cập nhật thông tin thành công!")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }
}