package com.example.backend.service;
import com.example.backend.dto.PostResponse;
import com.example.backend.model.Post;
import com.example.backend.repositories.PostRepository;
import com.example.backend.repositories.UserRepository;

// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.model.User;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
// import java.time.LocalDateTime;
import java.util.List;
// import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final String UPLOAD_DIR = "uploads/";

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
                post.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }

    public Post createPost(Long userId, String content, MultipartFile image) throws Exception {
        String imageUrl = null;

        if (image != null && !image.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            fileName = fileName.replaceAll("\\s+", "_"); // 🛠 Thay khoảng trắng bằng gạch dưới (_)
            
            Path filePath = Paths.get("uploads").resolve(fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, image.getBytes());
            
            imageUrl = fileName;
        }
        
        Post post = new Post();
        post.setUserId(userId);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        return postRepository.save(post);
    }
}
