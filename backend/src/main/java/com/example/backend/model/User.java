package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username không được để trống")
    @Column(unique = true)
    private String username;

    @NotBlank(message = "Password không được để trống")
    private String password;

    @Email(message = "Email không hợp lệ")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Full name không được để trống")
    @Column(name = "full_name", nullable = false)
    private String fullName;  // 👈 Thêm trường này vào entity

    private String avatarUrl; // 👈 Nếu bạn có cột avatar_url

    private LocalDateTime createdAt = LocalDateTime.now(); // 👈 Nếu có cột created_at
    // 👇 Các trường mới thêm vào:
    @Column(columnDefinition = "TEXT")
    private String bio;

    private LocalDate birthday;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum Role {
        USER, ADMIN
    }

    private boolean status = true;
}
