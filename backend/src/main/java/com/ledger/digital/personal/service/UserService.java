package com.ledger.digital.personal.service;

import com.ledger.digital.personal.dto.UserDto;
import com.ledger.digital.personal.mapper.UserMapper;
import com.ledger.digital.personal.model.User;
import com.ledger.digital.personal.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    // Create user
    public UserDto create(UserDto d) {
        return UserMapper.toDto(repo.save(UserMapper.toEntity(d)));
    }

    // List all users
    public List<UserDto> list() {
        return repo.findAll().stream().map(UserMapper::toDto).collect(Collectors.toList());
    }

    // Get single user
    public UserDto get(Long id) {
        return repo.findById(id).map(UserMapper::toDto).orElse(null);
    }

    // Update user (firstName, lastName, etc.)
    public UserDto updateUser(Long id, UserDto dto) {
        User user = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        // can extend to other editable fields
        repo.save(user);
        return UserMapper.toDto(user);
    }

    // Delete user
    public void deleteUser(Long id) {
        User user = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        repo.delete(user);
    }
}
