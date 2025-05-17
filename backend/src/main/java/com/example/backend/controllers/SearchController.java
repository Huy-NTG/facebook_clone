package com.example.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.SearchResultDTO;
import com.example.backend.service.SearchService;
@RestController
@RequestMapping("/api/search")
@CrossOrigin("*")
public class SearchController {
    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<SearchResultDTO> search(@RequestParam("keyword") String keyword) {
        SearchResultDTO result = searchService.searchByKeyword(keyword);
        return ResponseEntity.ok(result);
    }
}
