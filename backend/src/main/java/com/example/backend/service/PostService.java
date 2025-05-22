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
// import java.util.Optional;
@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<PostResponse> getAllPostsWithUser() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToPostResponse)
                .collect(Collectors.toList());
    }

    public Post createPost(Long userId, String content, MultipartFile image) throws Exception {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new RuntimeException("User not found"));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename().replaceAll("\\s+", "_");
            Path filePath = Paths.get("uploads").resolve(fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, image.getBytes());
            imageUrl = fileName;
        }

        Post post = new Post();
        post.setAuthor(user);            // ✅
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setStatus(true);
        return postRepository.save(post);
    }

    public List<PostResponse> getPostsByUserId(Long userId) {
        return postRepository.findByAuthor_Id(userId)   //  ← đổi ở đây
                             .stream()
                             .map(this::convertToPostResponse)
                             .collect(Collectors.toList());
    }
    

    // New method to toggle post status
    public String togglePostStatus(Long postId, Boolean status) {
        if (postId == null || status == null) return "postId hoặc status không được null!";
        return postRepository.findById(postId)
                .map(p -> { p.setStatus(status); postRepository.save(p); return "Cập nhật trạng thái thành công!"; })
                .orElse("Bài viết không tồn tại!");
    }

    public String updatePost(PostUpdateDTO postDTO) {
        return postRepository.findById(postDTO.getId())
                .map(p -> {
                    if (postDTO.getStatus() != null) p.setStatus(postDTO.getStatus());
                    postRepository.save(p);
                    return "Cập nhật trạng thái thành công!";
                })
                .orElse("Bài viết không tồn tại!");
    }

    // hàm tìm kiếm bài viết theo nội dung
    public List<PostResponse> searchPostsByContent(String keyword) {
        return postRepository.findByContentContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToPostResponse)
                .collect(Collectors.toList());
    }
    // định dạng trả về
    public PostResponse convertToPostResponse(Post post) {
        User author = post.getAuthor();                     // ✅
        return new PostResponse(
                post.getId(),
                author != null ? author.getId() : null,
                author != null ? author.getFullName() : "Người dùng không tồn tại",
                author != null ? author.getAvatarUrl() : null,
                post.getContent(),
                post.getImageUrl(),
                post.getStatus(),
                post.getCreatedAt()
        );
    }
    // hàm tìm kiếm bài viết theo id
    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với ID: " + id));
        return convertToPostResponse(post);
    }
    
    
    
}