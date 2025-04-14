package com.example.backend.controllers;

import com.example.backend.dto.PostResponse;
import com.example.backend.model.Post;
import com.example.backend.service.PostService;

// import jakarta.annotation.Resource;
// import jakarta.persistence.criteria.Path;
// import jakarta.validation.Valid;

// import org.apache.tomcat.util.http.parser.MediaType;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;


import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
// import java.util.Optional;
@RestController
@RequestMapping("/api/posts")
@CrossOrigin("*") // Cho phép truy cập từ frontend
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        List<PostResponse> posts = postService.getAllPostsWithUser();
        return ResponseEntity.ok(posts);
    }
    // 📌 API lấy hình ảnh từ thư mục uploads
    @GetMapping("/uploads/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Xác định loại MIME dựa trên file
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream"; // Nếu không xác định được, dùng loại mặc định
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    @PostMapping("/create")
    public ResponseEntity<?> createPost(
            @RequestParam("userId") Long userId,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Post post = postService.createPost(userId, content, image);
            return ResponseEntity.ok(Map.of("message", "Bài viết đã được đăng!", "post", post));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi khi đăng bài: " + e.getMessage()));
        }
    }
    // 📌 Lấy tất cả bài viết của một người dùng dựa trên userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getPostsByUserId(@PathVariable Long userId) {
        List<PostResponse> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }
}