package com.example.backend.service;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.PendingRequestDTO;
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
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

        if (friendshipRepository.findFriendshipBetweenUsers(sender, receiver).isPresent()) {
            throw new IllegalArgumentException("Lời mời đã tồn tại hoặc hai người đã kết bạn");
        }

        Friendship friendship = new Friendship(sender, receiver, FriendshipStatus.PENDING, new Timestamp(System.currentTimeMillis()));
        return friendshipRepository.save(friendship);
    }

    // Chấp nhận lời mời kết bạn
    public Friendship acceptFriendRequest(Long requestId) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Lời mời kết bạn không tồn tại"));

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        return friendshipRepository.save(friendship);
    }
    // Lấy danh sách bạn bè
    public List<User> getFriends(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));
    
        List<Friendship> friendships = friendshipRepository.findByUser1AndStatusOrUser2AndStatus(user, FriendshipStatus.ACCEPTED, user, FriendshipStatus.ACCEPTED);
        return friendships.stream()
                .map(f -> f.getUser1().equals(user) ? f.getUser2() : f.getUser1())
                .collect(Collectors.toList());
    }
    // Từ chối lời mời kết bạn
    public void rejectFriendRequest(Long requestId) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Lời mời kết bạn không tồn tại"));
        friendshipRepository.delete(friendship);
    }
    // Lấy danh sách lời mời kết bạn đang chờ xác nhận
    public List<PendingRequestDTO> getPendingFriendRequests(Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

    List<Friendship> pendingRequests = friendshipRepository.findByUser2AndStatus(user, FriendshipStatus.PENDING);

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    return pendingRequests.stream()
            .map(friendship -> {
                User sender = friendship.getUser1();
                return new PendingRequestDTO(
                        friendship.getId(),
                        sender.getId(),
                        sender.getUsername(),
                        sender.getEmail(),
                        sender.getFullName(),
                        sender.getAvatarUrl(),
                        sender.getCreatedAt().format(formatter)
                );
            })
            .collect(Collectors.toList());
        }
}