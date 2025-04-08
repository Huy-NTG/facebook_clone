package com.example.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingRequestDTO {
    private Long friendshipId;
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String createdAt;
}