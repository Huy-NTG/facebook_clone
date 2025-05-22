package com.example.backend.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // private Long userId; // Không cần thiết, vì đã có quan hệ với User
    private String content;
    private String imageUrl;
    private boolean status = true; // Trạng thái bài viết (có thể là public hoặc private)
    
    /* --- Quan hệ tới User --- */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)   // map vào cột user_id đã có
    private User author;                              // đặt tên tùy ý (author/owner/user …)

    // thộc tính của bài viết
    @CreationTimestamp // 🔥 Tự động set giá trị khi tạo bài viết
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Getter và Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    // public Long getUserId() { return userId; }
    // public void setUserId(Long userId) { this.userId = userId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean getStatus() { return status; } // Added getter
    public void setStatus(boolean status) { this.status = status; } // Added setter

    public LocalDateTime getCreatedAt() { return createdAt; }
    // thêm cho cột user ID
    public User getAuthor() {
        return author;
    }
    
    public void setAuthor(User author) {
        this.author = author;
    }
    
}