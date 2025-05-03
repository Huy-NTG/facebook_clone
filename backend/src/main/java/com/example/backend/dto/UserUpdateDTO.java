package com.example.backend.dto;

import com.example.backend.model.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Getter
@Setter
public class UserUpdateDTO {
    private Long id;
    private String fullName;
    private String bio;
    private LocalDate birthday;
    private User.Gender gender;

    private MultipartFile avatarFile; // file ảnh đại diện gửi từ frontend
}
