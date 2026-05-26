package com.rentalsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    // ✅ User ID (used by Booking module)
    private Long userId;

    // ✅ Email (for display / reference)
    private String email;

    // ✅ JWT Token (for authentication)
    private String token;
}
