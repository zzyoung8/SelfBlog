package com.young.selfblog.controller;

import com.young.selfblog.dto.BlogPostDTO;
import com.young.selfblog.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class BlogPostController {

    private final BlogPostService blogPostService;

    @Autowired
    public BlogPostController(BlogPostService blogPostService) {
        this.blogPostService = blogPostService;
    }

    @GetMapping
    public ResponseEntity<Page<BlogPostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        
        Page<BlogPostDTO> posts = blogPostService.getAllPosts(page, size, category, search);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPostDTO> getPostById(@PathVariable Long id) {
        BlogPostDTO post = blogPostService.getPostById(id);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Long id) {
        blogPostService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<BlogPostDTO>> getRelatedPosts(@PathVariable Long id) {
        List<BlogPostDTO> relatedPosts = blogPostService.getRelatedPosts(id);
        return ResponseEntity.ok(relatedPosts);
    }

    @PostMapping
    public ResponseEntity<BlogPostDTO> createPost(@RequestBody BlogPostDTO blogPostDTO) {
        BlogPostDTO createdPost = blogPostService.createPost(blogPostDTO);
        return ResponseEntity.ok(createdPost);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPostDTO> updatePost(
            @PathVariable Long id,
            @RequestBody BlogPostDTO blogPostDTO) {
        
        blogPostDTO.setId(id);
        BlogPostDTO updatedPost = blogPostService.updatePost(blogPostDTO);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        blogPostService.deletePost(id);
        return ResponseEntity.ok().build();
    }
} 