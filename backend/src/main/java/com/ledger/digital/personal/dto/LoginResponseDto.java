package com.ledger.digital.personal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class LoginResponseDto {

    @Schema(description = "Response message", example = "Login successful")
    private String message;

    @Schema(description = "Email of the logged-in user", example = "user@example.com")
    private String email;

    @Schema(description = "API key assigned to the user", example = "a1b2c3d4e5f6g7h8i9j0")
    private String apiKey;

    public LoginResponseDto() {
    }

    public LoginResponseDto(String message, String email, String apiKey) {
        this.message = message;
        this.email = email;
        this.apiKey = apiKey;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}
