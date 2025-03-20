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

        // Mã hóa mật khẩu trước khi lưu
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return "Đăng ký thành công!";
    }

    public Map<String, Object> login(String username, String rawPassword) {
        Optional<User> user = userRepository.findByUsername(username);
        Map<String, Object> response = new HashMap<>();

        if (user.isPresent() && passwordEncoder.matches(rawPassword, user.get().getPassword())) {
            response.put("message", "Đăng nhập thành công!");
            response.put("id", user.get().getId());
            response.put("username", user.get().getUsername());

            return response;
        }

        response.put("error", "Sai tên đăng nhập hoặc mật khẩu");
        return response;
    }
}
