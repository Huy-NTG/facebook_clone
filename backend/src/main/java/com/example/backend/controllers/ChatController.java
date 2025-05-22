package com.example.backend.controllers;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.backend.model.ChatMessage;

@Controller
public class ChatController {
   
    @MessageMapping("/sendMessage") // kênh nhận tin nhắn từ client
    @SendTo("/topic/messages") // Kênh trả dữ liệu về client
    public ChatMessage sendMessage(ChatMessage message) {
        // Gửi tin nhắn đến client tại kênh /topic/messages/{receiver}
        System.out.println("received message " + message);
        return message;
    }
    // leave
    @MessageMapping("/leave") // kênh nhận tin nhắn từ client
    @SendTo("/topic/messages") // Kênh trả dữ liệu về client
    public ChatMessage leave(String username) {
        // Gửi tin nhắn đến client tại kênh /topic/messages/{receiver}
        ChatMessage newMessage = new ChatMessage();
        newMessage.setContent(username + " has left the chat");
        newMessage.setSender("SYSTEM");
        newMessage.setType("LEAVE");
        return newMessage;
    }
    // join
    @MessageMapping("/join") // kênh nhận tin nhắn từ client, tin nhắn sẽ được gửi tới đây
    @SendTo("/topic/messages") // Kênh trả dữ liệu về client
    public ChatMessage join(String username) {
        // Gửi tin nhắn đến client tại kênh /topic/messages/{receiver}
        ChatMessage newMessage = new ChatMessage();
        // tắt thông báo từ hệ thống
        // newMessage.setContent(username + " has joined the chat");
        // newMessage.setSender("SYSTEM");
        // newMessage.setType("JOIN");
        return newMessage;
    }
}
