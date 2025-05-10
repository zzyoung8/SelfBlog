package com.young.selfblog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private String profileImage;
    private String position;
    private String university;
    private String researchDirection;
    private List<String> skills;
    private LocalDateTime createdAt;
} 