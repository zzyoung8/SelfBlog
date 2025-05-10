package com.young.selfblog.repository;

import com.young.selfblog.model.BlogPost;
import com.young.selfblog.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    Page<BlogPost> findByOrderByPublishedAtDesc(Pageable pageable);
    
    Page<BlogPost> findByAuthorIdOrderByPublishedAtDesc(Long authorId, Pageable pageable);
    
    Page<BlogPost> findByCategoriesInOrderByPublishedAtDesc(List<Category> categories, Pageable pageable);
    
    @Query("SELECT bp FROM BlogPost bp WHERE " +
           "bp.title LIKE %:query% OR " +
           "bp.excerpt LIKE %:query% OR " +
           "bp.content LIKE %:query%")
    Page<BlogPost> search(String query, Pageable pageable);
    
    List<BlogPost> findTop5ByFeaturedTrueOrderByPublishedAtDesc();
    
    List<BlogPost> findTop5ByOrderByViewCountDesc();
} 