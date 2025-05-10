package com.young.selfblog.service.impl;

import com.young.selfblog.dto.BlogPostDTO;
import com.young.selfblog.dto.CategoryDTO;
import com.young.selfblog.dto.UserDTO;
import com.young.selfblog.model.BlogPost;
import com.young.selfblog.model.Category;
import com.young.selfblog.repository.BlogPostRepository;
import com.young.selfblog.repository.CategoryRepository;
import com.young.selfblog.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogPostServiceImpl implements BlogPostService {

    private final BlogPostRepository blogPostRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public BlogPostServiceImpl(BlogPostRepository blogPostRepository, CategoryRepository categoryRepository) {
        this.blogPostRepository = blogPostRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public BlogPostDTO createPost(BlogPost post) {
        BlogPost savedPost = blogPostRepository.save(post);
        return convertToDTO(savedPost);
    }

    @Override
    public BlogPostDTO updatePost(Long id, BlogPost post) {
        BlogPost existingPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
        
        existingPost.setTitle(post.getTitle());
        existingPost.setExcerpt(post.getExcerpt());
        existingPost.setContent(post.getContent());
        existingPost.setCoverImage(post.getCoverImage());
        existingPost.setCategories(post.getCategories());
        existingPost.setTags(post.getTags());
        existingPost.setFeatured(post.isFeatured());
        
        BlogPost updatedPost = blogPostRepository.save(existingPost);
        return convertToDTO(updatedPost);
    }

    @Override
    public void deletePost(Long id) {
        blogPostRepository.deleteById(id);
    }

    @Override
    public BlogPostDTO getPostById(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
        return convertToDTO(post);
    }

    @Override
    public Page<BlogPostDTO> getAllPosts(Pageable pageable) {
        return blogPostRepository.findByOrderByPublishedAtDesc(pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<BlogPostDTO> getPostsByAuthor(Long authorId, Pageable pageable) {
        return blogPostRepository.findByAuthorIdOrderByPublishedAtDesc(authorId, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<BlogPostDTO> getPostsByCategory(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        
        return blogPostRepository.findByCategoriesInOrderByPublishedAtDesc(Collections.singletonList(category), pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<BlogPostDTO> searchPosts(String query, Pageable pageable) {
        return blogPostRepository.search(query, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public List<BlogPostDTO> getFeaturedPosts() {
        return blogPostRepository.findTop5ByFeaturedTrueOrderByPublishedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BlogPostDTO> getPopularPosts() {
        return blogPostRepository.findTop5ByOrderByViewCountDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void incrementViewCount(Long postId) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + postId));
        post.incrementViewCount();
        blogPostRepository.save(post);
    }

    private BlogPostDTO convertToDTO(BlogPost post) {
        BlogPostDTO dto = new BlogPostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setExcerpt(post.getExcerpt());
        dto.setContent(post.getContent());
        dto.setCoverImage(post.getCoverImage());
        
        // Set author
        UserDTO authorDTO = new UserDTO();
        authorDTO.setId(post.getAuthor().getId());
        authorDTO.setName(post.getAuthor().getName());
        authorDTO.setEmail(post.getAuthor().getEmail());
        authorDTO.setProfileImage(post.getAuthor().getProfileImage());
        dto.setAuthor(authorDTO);
        
        // Set categories
        List<CategoryDTO> categoryDTOs = post.getCategories().stream()
                .map(category -> {
                    CategoryDTO categoryDTO = new CategoryDTO();
                    categoryDTO.setId(category.getId());
                    categoryDTO.setName(category.getName());
                    categoryDTO.setDescription(category.getDescription());
                    categoryDTO.setPostCount(category.getPosts().size());
                    return categoryDTO;
                })
                .collect(Collectors.toList());
        dto.setCategories(categoryDTOs);
        
        dto.setTags(post.getTags());
        dto.setPublishedAt(post.getPublishedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setFeatured(post.isFeatured());
        dto.setViewCount(post.getViewCount());
        
        return dto;
    }
} 