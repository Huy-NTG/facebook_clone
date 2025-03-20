package com.example.backend.repositories;

import com.example.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId(Long userId); // Lấy tất cả bài viết của một user
    List<Post> findAllByOrderByCreatedAtDesc(); // Lấy bài viết mới nhất trước

}