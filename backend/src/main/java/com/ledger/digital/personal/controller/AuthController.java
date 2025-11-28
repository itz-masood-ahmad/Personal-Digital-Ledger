package com.ledger.digital.personal.controller;

import com.ledger.digital.personal.dto.ChangePasswordDto;
import com.ledger.digital.personal.dto.LoginDto;
import com.ledger.digital.personal.dto.LoginResponseDto;
import com.ledger.digital.personal.dto.RegisterDto;
import com.ledger.digital.personal.model.User;
import com.ledger.digital.personal.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration, login, and password management")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Register a new user with first name, last name, email, and password. Returns API key for authentication.")
    public ResponseEntity<LoginResponseDto> register(@RequestBody RegisterDto dto) {
        return ResponseEntity.ok(authService.register(dto));
    }

    @PostMapping("/login")
    @Operation(summary = "Login a user", description = "Login with email and password. Returns API key for authenticated requests.")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginDto dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password", description = "Change password for the logged-in user. Requires X-API-KEY header for authentication.")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDto dto,
                                                 @RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.getUserByApiKey(apiKey);
        authService.changePassword(user.getEmail(), dto);
        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset", description = "Send a password reset link to the user's email.")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        authService.sendForgotPasswordLink(email);
        return ResponseEntity.ok("Password reset link sent to your email (if it exists)");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token", description = "Reset the user's password using the token received via email.")
    public ResponseEntity<String> resetPassword(@RequestParam("token") String token,
                                                @RequestBody ChangePasswordDto dto) {
        authService.resetPassword(token, dto);
        return ResponseEntity.ok("Password has been reset successfully. You can now login.");
    }
}
