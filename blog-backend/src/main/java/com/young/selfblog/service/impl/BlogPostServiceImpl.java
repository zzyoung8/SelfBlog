package com.young.selfblog.service.impl;

import com.young.selfblog.dto.BlogPostDTO;
import com.young.selfblog.dto.CategoryDTO;
import com.young.selfblog.dto.UserDTO;
import com.young.selfblog.model.BlogPost;
import com.young.selfblog.model.Category;
import com.young.selfblog.model.User;
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
import java.util.Optional;
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
    public BlogPostDTO createPost(BlogPostDTO postDTO) {
        BlogPost post = convertToEntity(postDTO);
        BlogPost savedPost = blogPostRepository.save(post);
        return convertToDTO(savedPost);
    }

    @Override
    public BlogPostDTO updatePost(BlogPostDTO postDTO) {
        BlogPost existingPost = blogPostRepository.findById(postDTO.getId())
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + postDTO.getId()));
        
        existingPost.setTitle(postDTO.getTitle());
        existingPost.setExcerpt(postDTO.getExcerpt());
        existingPost.setContent(postDTO.getContent());
        existingPost.setCoverImage(postDTO.getCoverImage());
        
        // 更新分类
        if (postDTO.getCategories() != null) {
            List<Category> categories = postDTO.getCategories().stream()
                    .map(categoryDTO -> categoryRepository.findById(categoryDTO.getId())
                            .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryDTO.getId())))
                    .collect(Collectors.toList());
            existingPost.setCategories(categories);
        }
        
        existingPost.setTags(postDTO.getTags());
        existingPost.setFeatured(postDTO.isFeatured());
        
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
    public Page<BlogPostDTO> getAllPosts(int page, int size, String category, String search) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        
        if (search != null && !search.isEmpty()) {
            return searchPosts(search, pageable);
        }
        
        if (category != null && !category.isEmpty()) {
            Category categoryEntity = categoryRepository.findByName(category)
                    .orElseThrow(() -> new RuntimeException("Category not found with name: " + category));
            return getPostsByCategory(categoryEntity.getId(), pageable);
        }
        
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
//                    categoryDTO.setDescription(category.getDescription());
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
    
    @Override
    public List<BlogPostDTO> getRelatedPosts(Long postId) {
        // 获取当前文章
        BlogPost currentPost = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + postId));
        
        // 获取当前文章的分类
        List<Category> categories = currentPost.getCategories();
        if (categories.isEmpty()) {
            return Collections.emptyList();
        }
        
        // 查找同一分类下的其他文章
        List<BlogPost> relatedPosts = blogPostRepository.findByCategoriesInOrderByPublishedAtDesc(
                categories, org.springframework.data.domain.PageRequest.of(0, 5))
                .getContent()
                .stream()
                .filter(post -> !post.getId().equals(postId)) // 排除当前文章
                .limit(5)
                .collect(Collectors.toList());
        
        return relatedPosts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private BlogPost convertToEntity(BlogPostDTO dto) {
        BlogPost post = new BlogPost();
        post.setId(dto.getId());
        post.setTitle(dto.getTitle());
        post.setExcerpt(dto.getExcerpt());
        post.setContent(dto.getContent());
        post.setCoverImage(dto.getCoverImage());
        
        // 如果是新建博客文章，需要设置作者
        if (dto.getAuthor() != null) {
            User author = new User();
            author.setId(dto.getAuthor().getId());
            post.setAuthor(author);
        }
        
        // 设置分类
        if (dto.getCategories() != null) {
            List<Category> categories = dto.getCategories().stream()
                    .map(categoryDTO -> {
                        return categoryRepository.findById(categoryDTO.getId())
                                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryDTO.getId()));
                    })
                    .collect(Collectors.toList());
            post.setCategories(categories);
        }
        
        post.setTags(dto.getTags());
        post.setFeatured(dto.isFeatured());
        
        return post;
    }
}