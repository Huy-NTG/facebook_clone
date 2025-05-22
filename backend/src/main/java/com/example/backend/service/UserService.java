package com.example.backend.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.UserRegisterDTO;
import com.example.backend.dto.UserUpdateDTO;
import com.example.backend.model.User;
import com.example.backend.repositories.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder(); // Tạo instance thủ công
    }

    public String register(UserRegisterDTO dto) {
        // Tạo đối tượng User mới
        User user = new User();

        // Gán các giá trị từ DTO
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        // Đặt các giá trị mặc định
        user.setUsername(dto.getFullName()); // hoặc dùng UUID/random nếu bạn muốn
        user.setAvatarUrl("user_1.png"); // ảnh mặc định không được xóa khi thực thi chức năng bất kì
        user.setBio("Chưa có thông tin gì về bạn");
        user.setBirthday(LocalDate.of(2000, 1, 1));
        user.setGender(User.Gender.OTHER);
        user.setRole(User.Role.USER);

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email đã tồn tại!";
        }
        userRepository.save(user);
    return "Đăng ký thành công!";
    }
    // // Đăng nhập
    public Map<String, Object> login(String email, String rawPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        Map<String, Object> response = new HashMap<>();

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                // Check user status
                // For a primitive boolean 'status', it cannot be null.
                // Use isStatus() which is the standard Lombok getter for boolean.
                if (!user.isStatus()) { // If status is false, it means banned/inactive
                    response.put("error", "Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt.");
                    return response;
                }

                // Proceed with successful login
                response.put("message", "Đăng nhập thành công!");
                response.put("id", user.getId());
                response.put("username", user.getUsername());
                response.put("fullName", user.getFullName());
                response.put("email", user.getEmail());
                response.put("avatarUrl", user.getAvatarUrl());
                response.put("role", user.getRole().name());
                return response;
            }
        }

        response.put("error", "Sai tên đăng nhập hoặc mật khẩu");
        return response;
    }
    
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    // Cập nhật thông tin người dùng
    public String updateUser(UserUpdateDTO dto) {
    try {
        Optional<User> optionalUser = userRepository.findById(dto.getId());
        if (optionalUser.isEmpty()) {
            return "Người dùng không tồn tại!";
        }

        User user = optionalUser.get();
        String oldAvatar = user.getAvatarUrl();
        MultipartFile avatarFile = dto.getAvatarFile();
        String defaultAvatar = "user_1.png";

        // Handle avatar file
        if (avatarFile != null && !avatarFile.isEmpty()) {
            String newAvatarName = UUID.randomUUID() + "_" + avatarFile.getOriginalFilename();
            newAvatarName = newAvatarName.replaceAll("\\s+", "_");
            String uploadsDir = System.getProperty("user.dir") + File.separator + "uploads";
            Path uploadPath = Paths.get(uploadsDir);
            Path filePath = uploadPath.resolve(newAvatarName);

            try {
                Files.createDirectories(uploadPath);
                avatarFile.transferTo(filePath.toFile());

                if (oldAvatar != null && !oldAvatar.equals(defaultAvatar)) {
                    long count = userRepository.countByAvatarUrl(oldAvatar);
                    if (count <= 1) {
                        Path oldFilePath = uploadPath.resolve(oldAvatar);
                        Files.deleteIfExists(oldFilePath);
                    }
                }
                user.setAvatarUrl(newAvatarName);
            } catch (IOException e) {
                e.printStackTrace();
                return "Không thể lưu ảnh đại diện: " + e.getMessage();
            }
        }

        // Update fields only if provided
        if (dto.getFullName() != null) {
            user.setFullName(dto.getFullName());
        }
        if (dto.getBio() != null) {
            user.setBio(dto.getBio());
        }
        if (dto.getBirthday() != null) {
            user.setBirthday(dto.getBirthday());
        }
        if (dto.getGender() != null) {
            user.setGender(dto.getGender());
        }
        if (dto.getStatus() != null) {
            user.setStatus(dto.getStatus()); // Add status update
        }

        userRepository.save(user);
        return "Cập nhật thông tin thành công!";
    } catch (Exception e) {
        e.printStackTrace();
        return "Lỗi khi cập nhật thông tin: " + e.getMessage();
    }
}
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public String toggleUserStatus(Long id, Boolean status) {
    try {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return "Người dùng không tồn tại!";
        }
        User user = optionalUser.get();
        user.setStatus(status);
        userRepository.save(user);
        return "Cập nhật trạng thái thành công!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi cập nhật trạng thái: " + e.getMessage();
        }
    }
    public List<User> searchUsersByFullName(String keyword) {
        return userRepository.findByFullNameContainingIgnoreCase(keyword);
    }
}