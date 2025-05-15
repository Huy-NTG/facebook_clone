package com.example.backend.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // Kênh server trả dữ liệu về client
        config.setApplicationDestinationPrefixes("/app"); // Kênh client gửi lên server
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // Đường dẫn kết nối từ frontend
        .setAllowedOriginPatterns("*"); // Cho phép tất cả các nguồn gốc (origins) truy cập vào endpoint này
                //.setAllowedOrigins("http://localhost:5173")
                //.withSockJS(); // Hỗ trợ fallback nếu trình duyệt không hỗ trợ WebSocket
    }
}
