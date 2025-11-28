package com.ledger.digital.personal.controller;

import com.ledger.digital.personal.dto.UserDto;
import com.ledger.digital.personal.model.User;
import com.ledger.digital.personal.service.AuthService;
import com.ledger.digital.personal.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @Operation(summary = "Create a new user")
    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.create(userDto));
    }

    @Operation(summary = "Get all users")
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.list());
    }

    @Operation(summary = "Get single user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        UserDto userDto = userService.get(id);
        if (userDto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(userDto);
    }

    @Operation(
            summary = "Update user info",
            description = "Requires valid x-api-key header of the user",
            security = @SecurityRequirement(name = "x-api-key")
    )
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDto userDto,
            @RequestHeader("x-api-key") String apiKey
    ) {
        // Validate API key
        User apiUser = authService.getUserByApiKey(apiKey);
        if (!apiUser.getId().equals(id)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        UserDto updatedUser = userService.updateUser(id, userDto);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(
            summary = "Delete user",
            description = "Requires valid x-api-key header of the user",
            security = @SecurityRequirement(name = "x-api-key")
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @RequestHeader("x-api-key") String apiKey
    ) {
        // Validate API key
        User apiUser = authService.getUserByApiKey(apiKey);
        if (!apiUser.getId().equals(id)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
