package com.example.backend.service;

// import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.CommentRequest;
import com.example.backend.dto.CommentResponse;
import com.example.backend.model.Comment;
import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.example.backend.repositories.CommentRepository;
import com.example.backend.repositories.PostRepository;
import com.example.backend.repositories.UserRepository;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
     @Autowired
    private UserRepository userRepository;  // ✅ Thêm UserRepository để lấy user
    @Autowired
    private PostRepository postRepository;  // ✅ Thêm PostRepository để lấy post
    // Thêm bình luận mới
    public CommentResponse addComment(CommentRequest request) {
        Post post = postRepository.findById(request.getPostId()).orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(request.getContent());
        
        comment = commentRepository.save(comment);

        return new CommentResponse(comment);
    }

     // Lấy danh sách bình luận theo bài viết
     public List<CommentResponse> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream().map(CommentResponse::new).collect(Collectors.toList());
    }
}