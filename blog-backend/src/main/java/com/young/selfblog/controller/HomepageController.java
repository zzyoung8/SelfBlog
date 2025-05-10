package com.young.selfblog.controller;

import com.young.selfblog.dto.BlogPostDTO;
import com.young.selfblog.dto.UserDTO;
import com.young.selfblog.service.BlogPostService;
import com.young.selfblog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/homepage")
@CrossOrigin(origins = "*")
public class HomepageController {

    private final UserService userService;
    private final BlogPostService blogPostService;

    @Autowired
    public HomepageController(UserService userService, BlogPostService blogPostService) {
        this.userService = userService;
        this.blogPostService = blogPostService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHomepageData() {
        // Assuming the first user in the system is the blog owner
        List<UserDTO> users = userService.getAllUsers();
        UserDTO blogOwner = users.isEmpty() ? null : users.get(0);
        
        // Get featured blog posts
        List<BlogPostDTO> featuredPosts = blogPostService.getFeaturedPosts();
        
        // Get popular blog posts
        List<BlogPostDTO> popularPosts = blogPostService.getPopularPosts();
        
        Map<String, Object> response = new HashMap<>();
        response.put("blogOwner", blogOwner);
        response.put("featuredPosts", featuredPosts);
        response.put("popularPosts", popularPosts);
        
        return ResponseEntity.ok(response);
    }
} 