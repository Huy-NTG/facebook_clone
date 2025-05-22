package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
         // ✅ server có thể gửi broadcast (/topic/…) **và** gửi riêng (/queue/…)
        config.enableSimpleBroker("/topic", "/queue"); // Kênh server trả dữ liệu về client
        config.setApplicationDestinationPrefixes("/app"); // Kênh client gửi lên server
        // ✅ Spring sẽ tự biến convertAndSendToUser("3", …)
        // thành /user/3/queue/…
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // Đường dẫn kết nối từ frontend
        .setAllowedOriginPatterns("*") // Cho phép tất cả các nguồn gốc (origins) truy cập vào endpoint này, đây là cách kết nối thành công
        .setHandshakeHandler(customHandshakeHandler()); // 👈
                //.setAllowedOrigins("http://localhost:5173")
                //.withSockJS(); // Hỗ trợ fallback nếu trình duyệt không hỗ trợ WebSocket
    }

    /** Trả về HandshakeHandler tự gắn Principal = userId */
    @Bean
    public DefaultHandshakeHandler customHandshakeHandler() {
        return new DefaultHandshakeHandler() {
            @Override
            protected Principal determineUser(ServerHttpRequest req,
                                              WebSocketHandler wsHandler,
                                              Map<String, Object> attrs) {

                // lấy userId từ query string
                String userId = UriComponentsBuilder.fromUri(req.getURI())
                                   .build()
                                   .getQueryParams()
                                   .getFirst("userId");

                // fallback nếu thiếu
                if (userId == null || userId.isBlank()) {
                    userId = UUID.randomUUID().toString();
                }

                String finalUserId = userId;
                return () -> finalUserId;  // Principal#getName()
            }
        };
    }
}
