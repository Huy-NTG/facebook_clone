package com.example.backend.dto;


//import com.example.backend.dto.UserResponseDTO;
import java.util.List;
public class SearchResultDTO {
    private List<UserResponseDTO> users;
    private List<PostResponse> posts;

    public SearchResultDTO(List<UserResponseDTO> users, List<PostResponse> posts) {
        this.users = users;
        this.posts = posts;
    }

    public List<UserResponseDTO> getUsers() {
        return users;
    }

    public List<PostResponse> getPosts() {
        return posts;
    }
}
