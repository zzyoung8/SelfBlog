package com.young.selfblog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostDTO {
    private Long id;
    private String title;
    private String excerpt;
    private String content;
    private String coverImage;
    private UserDTO author;
    private List<CategoryDTO> categories;
    private List<String> tags;
    private LocalDateTime publishedAt;
    private LocalDateTime updatedAt;
    private boolean featured;
    private Integer viewCount;
} 