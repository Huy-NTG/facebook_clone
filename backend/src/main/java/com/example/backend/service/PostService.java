package com.example.backend.service;

import com.example.backend.dto.PostResponse;
import com.example.backend.dto.PostUpdateDTO;
import com.example.backend.model.Post;
import com.example.backend.repositories.PostRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.model.User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<PostResponse> getAllPostsWithUser() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        
        return posts.stream().map(post -> {
            User user = userRepository.findById(post.getUserId()).orElse(null);
            return new PostResponse(
                post.getId(),
                post.getUserId(),
                user != null ? user.getFullName() : "Người dùng không tồn tại",
                user != null ? user.getAvatarUrl() : null,
                post.getContent(),
                post.getImageUrl(),
                post.getStatus(), // Include status
                post.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }

    public Post createPost(Long userId, String content, MultipartFile image) throws Exception {
        String imageUrl = null;

        if (image != null && !image.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            fileName = fileName.replaceAll("\\s+", "_");
            
            Path filePath = Paths.get("uploads").resolve(fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, image.getBytes());
            
            imageUrl = fileName;
        }
        
        Post post = new Post();
        post.setUserId(userId);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setStatus(true); // Explicitly set default status
        return postRepository.save(post);
    }

    public List<PostResponse> getPostsByUserId(Long userId) {
        List<Post> posts = postRepository.findByUserId(userId);
    
        return posts.stream().map(post -> {
            User user = userRepository.findById(post.getUserId()).orElse(null);
            return new PostResponse(
                post.getId(),
                post.getUserId(),
                user != null ? user.getFullName() : "Người dùng không tồn tại",
                user != null ? user.getAvatarUrl() : null,
                post.getContent(),
                post.getImageUrl(),
                post.getStatus(), // Include status
                post.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }

    // New method to toggle post status
    public String togglePostStatus(Long postId, Boolean status) {
        try {
            if (postId == null || status == null) {
                return "postId hoặc status không được null!";
            }
            Optional<Post> optionalPost = postRepository.findById(postId);
            if (optionalPost.isEmpty()) {
                return "Bài viết không tồn tại!";
            }
            Post post = optionalPost.get();
            post.setStatus(status);
            postRepository.save(post);
            return "Cập nhật trạng thái thành công!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi cập nhật trạng thái: " + e.getClass().getName() + ": " + e.getMessage();
        }
    }
    public String updatePost(PostUpdateDTO postDTO) {
    try {
        Optional<Post> optionalPost = postRepository.findById(postDTO.getId());
        if (optionalPost.isEmpty()) {
            return "Bài viết không tồn tại!";
        }
        Post post = optionalPost.get();
        if (postDTO.getStatus() != null) {
            post.setStatus(postDTO.getStatus());
        }
        postRepository.save(post);
        return "Cập nhật trạng thái thành công!";
    } catch (Exception e) {
        e.printStackTrace();
        return "Lỗi khi cập nhật trạng thái: " + e.getMessage();
    }
}
}