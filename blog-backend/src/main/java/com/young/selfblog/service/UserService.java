package com.young.selfblog.service;

import com.young.selfblog.dto.UserDTO;
import com.young.selfblog.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserDTO createUser(User user);
    UserDTO updateUser(Long id, User user);
    void deleteUser(Long id);
    UserDTO getUserById(Long id);
    UserDTO getUserByEmail(String email);
    List<UserDTO> getAllUsers();
    boolean existsByEmail(String email);
} 