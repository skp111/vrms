package com.rentalsphere.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    // ✅ User email (login credential)
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    // ✅ Password (plain, will be matched with encrypted)
    @NotBlank(message = "Password is required")
    private String password;
}