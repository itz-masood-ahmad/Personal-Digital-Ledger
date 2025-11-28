package com.ledger.digital.personal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public class ChangePasswordDto {

    @Schema(description = "Current password of the user", example = "oldPass123")
    private String oldPassword;

    @Schema(description = "New password the user wants to set", example = "newPass123")
    private String newPassword;

    @Schema(description = "Confirmation of the new password", example = "newPass123")
    private String confirmNewPassword;

    // No-arg constructor
    public ChangePasswordDto() {
    }

    // All-args constructor
    public ChangePasswordDto(String oldPassword, String newPassword, String confirmNewPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.confirmNewPassword = confirmNewPassword;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmNewPassword() {
        return confirmNewPassword;
    }

    public void setConfirmNewPassword(String confirmNewPassword) {
        this.confirmNewPassword = confirmNewPassword;
    }
}
