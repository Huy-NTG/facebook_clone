package com.example.backend.service;

import com.example.backend.dto.PostResponse;
import com.example.backend.dto.SearchResultDTO;
import com.example.backend.dto.UserResponseDTO;
import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.example.backend.repositories.PostRepository;
import com.example.backend.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostService postService;

    public SearchService(UserRepository userRepository, PostRepository postRepository, PostService postService) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.postService = postService;
    }

    public SearchResultDTO searchByKeyword(String keyword) {
        List<User> users = userRepository.findByFullNameContainingIgnoreCase(keyword);
        List<UserResponseDTO> userDTOs = users.stream()
                .map(user -> new UserResponseDTO(user.getId(), user.getFullName(), user.getAvatarUrl()))
                .collect(Collectors.toList());

        List<Post> posts = postRepository.findByContentContainingIgnoreCase(keyword);
        List<PostResponse> postDTOs = posts.stream()
                .map(post -> postService.convertToPostResponse(post))
                .collect(Collectors.toList());

        return new SearchResultDTO(userDTOs, postDTOs);
    }
}
