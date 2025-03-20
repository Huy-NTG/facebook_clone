package com.example.backend.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Friendship;
import com.example.backend.model.FriendshipStatus;
import com.example.backend.model.User;
import com.example.backend.repositories.FriendshipRepository;
import com.example.backend.repositories.UserRepository;

@Service
public class FriendshipService {
    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;

    // Gửi lời mời kết bạn
    public Friendship sendFriendRequest(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        if (friendshipRepository.findByUser1AndUser2(sender, receiver).isPresent()) {
            throw new RuntimeException("Lời mời đã tồn tại");
        }

        Friendship friendship = new Friendship();
        friendship.setUser1(sender);
        friendship.setUser2(receiver);
        friendship.setStatus(FriendshipStatus.PENDING);
        friendship.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        return friendshipRepository.save(friendship);
    }

    // Chấp nhận lời mời kết bạn
    public Friendship acceptFriendRequest(Long requestId) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Lời mời kết bạn không tồn tại"));

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        return friendshipRepository.save(friendship);
    }

    // Lấy danh sách bạn bè
    public List<User> getFriends(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        List<Friendship> friendships = friendshipRepository.findByUser1OrUser2AndStatus(user, user, FriendshipStatus.ACCEPTED);

        return friendships.stream()
                .map(f -> f.getUser1().equals(user) ? f.getUser2() : f.getUser1())
                .collect(Collectors.toList());
    }
}
