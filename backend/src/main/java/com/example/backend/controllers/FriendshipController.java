package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.model.Friendship;
import com.example.backend.model.User;
import com.example.backend.service.FriendshipService;

@RestController
@RequestMapping("/api/friends")
public class FriendshipController {
    @Autowired
    private FriendshipService friendshipService;

    // Gửi lời mời kết bạn
    @PostMapping("/request")
    public ResponseEntity<Friendship> sendFriendRequest(@RequestParam Long senderId, @RequestParam Long receiverId) {
        Friendship friendship = friendshipService.sendFriendRequest(senderId, receiverId);
        return ResponseEntity.ok(friendship);
    }

    // Chấp nhận lời mời kết bạn
    @PostMapping("/{requestId}/accept")
    public ResponseEntity<Friendship> acceptFriendRequest(@PathVariable Long requestId) {
        Friendship friendship = friendshipService.acceptFriendRequest(requestId);
        return ResponseEntity.ok(friendship);
    }

    // Từ chối lời mời kết bạn
    @PostMapping("/{requestId}/reject")
    public ResponseEntity<String> rejectFriendRequest(@PathVariable Long requestId) {
        friendshipService.rejectFriendRequest(requestId);
        return ResponseEntity.ok("Lời mời kết bạn đã bị từ chối.");
    }

     // Lấy danh sách bạn bè của một người
     @GetMapping("/{userId}")
     public ResponseEntity<List<User>> getFriends(@PathVariable Long userId) {
         List<User> friends = friendshipService.getFriends(userId);
         return ResponseEntity.ok(friends);
     }
     // API lấy danh sách lời mời kết bạn đang chờ xác nhận
    @GetMapping("/{userId}/pending-requests")
    public ResponseEntity<List<User>> getPendingFriendRequests(@PathVariable Long userId) {
        List<User> pendingRequests = friendshipService.getPendingFriendRequests(userId);
        return ResponseEntity.ok(pendingRequests);
    }

}
