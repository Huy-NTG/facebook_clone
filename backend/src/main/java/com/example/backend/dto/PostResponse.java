package com.example.backend.dto;
import java.time.LocalDateTime;
public class PostResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String avatarUrl;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;

    public PostResponse(Long id, Long userId, String fullName, String avatarUrl, String content, String imageUrl, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.content = content;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getFullName() { return fullName; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getContent() { return content; }
    public String getImageUrl() { return imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
