package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.HashMap;
import java.util.Map;
@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder(); // Tạo instance thủ công
    }

    public String register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "Username đã tồn tại!";
        }
    
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email đã tồn tại!";
        }
    
        // Nếu username không có, đặt username = email
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            user.setUsername(user.getFullName());
        }
    
        // Nếu avatarUrl không có, đặt ảnh mặc định
        if (user.getAvatarUrl() == null || user.getAvatarUrl().isBlank()) {
            user.setAvatarUrl("user_1.jpg");
        }
    
        // Mã hóa mật khẩu trước khi lưu
        user.setPassword(passwordEncoder.encode(user.getPassword()));
    
        userRepository.save(user);
    
        return "Đăng ký thành công!";
    }
    

    public Map<String, Object> login(String email, String rawPassword) {
        Optional<User> user = userRepository.findByEmail(email);
        Map<String, Object> response = new HashMap<>();

        if (user.isPresent() && passwordEncoder.matches(rawPassword, user.get().getPassword())) {
            response.put("message", "Đăng nhập thành công!");
            response.put("id", user.get().getId());
            response.put("username", user.get().getUsername());
            response.put("avatarUrl", user.get().getAvatarUrl());
            return response;
        }

        response.put("error", "Sai tên đăng nhập hoặc mật khẩu");
        return response;
    }
}
