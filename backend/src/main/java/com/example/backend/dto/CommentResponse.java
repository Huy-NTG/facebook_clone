package com.example.backend.dto;

import java.sql.Timestamp;

import com.example.backend.model.Comment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentResponse {
    private Long id;
    private String content;
    private Timestamp createdAt;
    private Long postId;
    private Long userId;
    private String userName;
    private String avatarUrl;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.postId = comment.getPost().getId();
        this.userId = comment.getUser().getId();
        this.userName = comment.getUser().getFullName();
        this.avatarUrl = comment.getUser().getAvatarUrl();
    }
}
