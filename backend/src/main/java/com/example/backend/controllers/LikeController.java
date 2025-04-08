package com.example.backend.controllers;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.service.LikeService;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(@RequestParam Long postId, @RequestParam Long userId) {
        String result = likeService.toggleLike(postId, userId);
        return ResponseEntity.ok(Collections.singletonMap("message", result));
    }

    @GetMapping("/count")
    public ResponseEntity<?> countLikes(@RequestParam Long postId) {
        long count = likeService.countLikes(postId);
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }
    @GetMapping("/isLiked")
    public ResponseEntity<Boolean> isLiked(@RequestParam Long postId, @RequestParam Long userId) {
        boolean isLiked = likeService.isPostLikedByUser(postId, userId);
        return ResponseEntity.ok(isLiked);
    }

}

