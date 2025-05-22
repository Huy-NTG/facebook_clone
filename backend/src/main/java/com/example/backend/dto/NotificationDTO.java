package com.example.backend.dto;

import com.example.backend.model.Post;
import com.example.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO dùng để đẩy thông báo realtime qua WebSocket.
 */
@Data               // sinh getter/setter/toString/hashCode/equals
@Builder            // hỗ trợ builder pattern
@NoArgsConstructor  // sinh constructor rỗng
@AllArgsConstructor // sinh constructor đầy đủ tham số
public class NotificationDTO {
    private Long   senderId;
    private String senderName;
    private String senderAvatar;
    private String type;        // "LIKE", "COMMENT", ...
    private String content;     // Ví dụ: "A đã thích bài viết của bạn"
    private Long   postId;
    private String postImageUrl;

    /** Factory method tiện dụng cho sự kiện LIKE */
    public static NotificationDTO like(User sender, Post post) {
        return NotificationDTO.builder()
                .senderId(sender.getId())
                .senderName(sender.getFullName())
                .senderAvatar(sender.getAvatarUrl())
                .type("LIKE")
                .content(sender.getFullName() + " đã thích bài viết của bạn")
                .postId(post.getId())
                .postImageUrl(post.getImageUrl())
                .build();
    }
    /** Factory method tiện dụng cho sự kiện COMMENT */
    public static NotificationDTO comment(User sender, Post post) {
        return NotificationDTO.builder()
                .senderId(sender.getId())
                .senderName(sender.getFullName())
                .senderAvatar(sender.getAvatarUrl())
                .type("COMMENT")
                .content(sender.getFullName() + " đã bình luận bài viết của bạn")
                .postId(post.getId())
                .postImageUrl(post.getImageUrl()) // ✅ THÊM DÒNG NÀY
                .build();
    }
}
