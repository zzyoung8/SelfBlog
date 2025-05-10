package com.young.selfblog.service.impl;

import com.young.selfblog.dto.UserDTO;
import com.young.selfblog.model.User;
import com.young.selfblog.repository.UserRepository;
import com.young.selfblog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDTO createUser(User user) {
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Override
    public UserDTO updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        existingUser.setName(user.getName());
        existingUser.setBio(user.getBio());
        existingUser.setProfileImage(user.getProfileImage());
        existingUser.setPosition(user.getPosition());
        existingUser.setUniversity(user.getUniversity());
        existingUser.setResearchDirection(user.getResearchDirection());
        existingUser.setSkills(user.getSkills());
        
        User updatedUser = userRepository.save(existingUser);
        return convertToDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToDTO(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return convertToDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setProfileImage(user.getProfileImage());
        dto.setPosition(user.getPosition());
        dto.setUniversity(user.getUniversity());
        dto.setResearchDirection(user.getResearchDirection());
        dto.setSkills(user.getSkills());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
} 