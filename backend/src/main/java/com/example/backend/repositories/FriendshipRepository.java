package com.example.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Friendship;
import com.example.backend.model.FriendshipStatus;
import com.example.backend.model.User;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    
    // Lấy danh sách bạn bè đã chấp nhận
    List<Friendship> findByUser1AndStatusOrUser2AndStatus(User user1, FriendshipStatus status1, User user2, FriendshipStatus status2);


    // Kiểm tra xem hai người có kết bạn chưa (dù ai gửi lời mời)
    @Query("SELECT f FROM Friendship f WHERE (f.user1 = :user1 AND f.user2 = :user2) OR (f.user1 = :user2 AND f.user2 = :user1)")
    Optional<Friendship> findFriendshipBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);

    // Lấy danh sách lời mời kết bạn đang chờ xác nhận
    List<Friendship> findByUser2AndStatus(User user2, FriendshipStatus status);
}
