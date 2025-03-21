package com.example.backend.model;

import java.sql.Timestamp;  // Đảm bảo bạn import đúng thư viện này!

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
// import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post; // 👈 Mỗi bình luận thuộc về 1 bài viết

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 👈 Mỗi bình luận thuộc về 1 người dùng

    private String content;
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis()); // Tự động lấy thời gian hiện tại
}
