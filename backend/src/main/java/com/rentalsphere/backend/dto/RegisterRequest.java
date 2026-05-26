package com.rentalsphere.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    // ✅ Full name
    @NotBlank(message = "Name is required")
    @Size(max = 50, message = "Name cannot exceed 50 characters")
    private String name;

    // ✅ Email
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    // ✅ Password
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private String mobile;
    private String address;
    private String licenseNumber;
    private String role;
}
