package com.ledger.digital.personal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class LoginDto {

    @Schema(description = "Email of the user for login", example = "user@example.com")
    private String email;

    @Schema(description = "Password of the user for login", example = "P@ssw0rd123")
    private String password;

    public LoginDto() {
    }

    public LoginDto(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
