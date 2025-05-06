package com.example.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserReposeUpdate {
    private Long id;
    private String fullName; // hoặc username nếu có
    private String avatarUrl;
    private String message;
}
