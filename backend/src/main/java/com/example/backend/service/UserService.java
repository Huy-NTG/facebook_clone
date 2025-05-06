package com.example.backend.service;

import com.example.backend.dto.UserRegisterDTO;
import com.example.backend.dto.UserUpdateDTO;
import com.example.backend.model.User;
import com.example.backend.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.UUID;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.nio.file.Path;

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
    // Đăng nhập
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
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    // Cập nhật thông tin người dùng
    public String updateUser(UserUpdateDTO dto) {
        Optional<User> optionalUser = userRepository.findById(dto.getId());
    
        if (optionalUser.isEmpty()) {
            return "Người dùng không tồn tại!";
        }
    
        User user = optionalUser.get();
        String oldAvatar = user.getAvatarUrl();
        MultipartFile avatarFile = dto.getAvatarFile();
        String defaultAvatar = "user_1.png";
    
        if (avatarFile != null && !avatarFile.isEmpty()) {
            // Tạo tên file mới
            String newAvatarName = UUID.randomUUID() + "_" + avatarFile.getOriginalFilename();
            newAvatarName = newAvatarName.replaceAll("\\s+", "_");
    
            // Đường dẫn tuyệt đối đến thư mục uploads
            String uploadsDir = System.getProperty("user.dir") + File.separator + "uploads";
            Path uploadPath = Paths.get(uploadsDir);
            Path filePath = uploadPath.resolve(newAvatarName);
    
            try {
                Files.createDirectories(uploadPath); // Tạo thư mục nếu chưa có
                avatarFile.transferTo(filePath.toFile()); // Lưu file mới
    
                // Xóa ảnh cũ nếu không phải mặc định và không user nào khác dùng
                if (oldAvatar != null && !oldAvatar.equals(defaultAvatar)) {
                    long count = userRepository.countByAvatarUrl(oldAvatar);
                    if (count <= 1) {
                        Path oldFilePath = uploadPath.resolve(oldAvatar);
                        Files.deleteIfExists(oldFilePath);
                    }
                }
    
                // Cập nhật ảnh đại diện mới
                user.setAvatarUrl(newAvatarName);
    
            } catch (IOException e) {
                e.printStackTrace();
                return "Không thể lưu ảnh đại diện!";
            }
        }
    
        // Cập nhật các thông tin khác
        user.setFullName(dto.getFullName());
        user.setBio(dto.getBio());
        user.setBirthday(dto.getBirthday());
        user.setGender(dto.getGender());
    
        userRepository.save(user);
        return "Cập nhật thông tin thành công!";
    }
    
}