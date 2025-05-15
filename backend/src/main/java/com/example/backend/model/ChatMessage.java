package com.example.backend.model;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
public class ChatMessage {
    private Long idUser; // id dùng để truy xác người gửi tin nhắn 
    private String sender;
    private String receiver;
    private String content;
    private String type; // "CHAT" hoặc "LEAVE"
    private String imaStringe; // Hình ảnh của người gửi
    
}
