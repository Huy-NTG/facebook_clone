package com.example.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.backend.dto.NotificationDTO;
import com.example.backend.model.Like;
import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.example.backend.repositories.LikeRepository;
import com.example.backend.repositories.PostRepository;
import com.example.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor        // dùng Lombok tạo constructor cho field final
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private final SimpMessagingTemplate messagingTemplate;   // <- inject

    public String toggleLike(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return "Unliked";
        } else {
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            likeRepository.save(like);
            /* ----------  GỬI THÔNG BÁO REALTIME ---------- */
        if (!userId.equals(post.getAuthor().getId())) {              // tự like thì khỏi báo
            NotificationDTO noti = NotificationDTO.like(user, post); // factory tiện dụng
            // ① Lưu DB nếu cần
            // notificationRepository.save(notiEntity);
            // ② Push tới tác giả bài viết
            messagingTemplate.convertAndSendToUser(
                    post.getAuthor().getId().toString(),
                    "/queue/notifications",
                    noti
            );
        }
            return "Liked";
        }
    }

    public long countLikes(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return likeRepository.countByPost(post);
    }
    public boolean isPostLikedByUser(Long postId, Long userId) {
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }
    
}