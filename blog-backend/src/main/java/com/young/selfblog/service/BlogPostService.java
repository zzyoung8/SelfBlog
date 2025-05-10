package com.young.selfblog.service;

import com.young.selfblog.dto.BlogPostDTO;
import com.young.selfblog.model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BlogPostService {
    BlogPostDTO createPost(BlogPostDTO postDTO);
    BlogPostDTO updatePost(BlogPostDTO postDTO);
    void deletePost(Long id);
    BlogPostDTO getPostById(Long id);
    Page<BlogPostDTO> getAllPosts(int page, int size, String category, String search);
    Page<BlogPostDTO> getPostsByAuthor(Long authorId, Pageable pageable);
    Page<BlogPostDTO> getPostsByCategory(Long categoryId, Pageable pageable);
    Page<BlogPostDTO> searchPosts(String query, Pageable pageable);
    List<BlogPostDTO> getFeaturedPosts();
    List<BlogPostDTO> getPopularPosts();
    List<BlogPostDTO> getRelatedPosts(Long postId);
    void incrementViewCount(Long postId);
} 