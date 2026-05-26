package com.rentalsphere.backend.controller;

import com.rentalsphere.backend.dto.AuthResponse;
import com.rentalsphere.backend.dto.LoginRequest;
import com.rentalsphere.backend.dto.RegisterRequest;
import com.rentalsphere.backend.model.User;
import com.rentalsphere.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    // ✅ REGISTER USER
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        userService.registerUser(request);
        return ResponseEntity.ok("User registered successfully");
    }

    // ✅ LOGIN USER (Returns JWT Token)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = userService.loginUser(request);
        return ResponseEntity.ok(response);
    }

    // ✅ GET USER DETAILS (for integration with other modules)
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }

    // ✅ UPDATE PASSWORD
    @PutMapping("/update-password/{id}")
    public ResponseEntity<String> updatePassword(
            @PathVariable Long id,
            @RequestParam String newPassword
    ) {
        userService.updatePassword(id, newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }

    // ✅ UPDATE LICENSE
    @PutMapping("/update-license/{id}")
    public ResponseEntity<String> updateLicense(
            @PathVariable Long id,
            @RequestParam String license
    ) {
        userService.updateLicense(id, license);
        return ResponseEntity.ok("License updated successfully");
    }

    // ✅ FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody com.rentalsphere.backend.dto.ForgotPasswordRequest request
    ) {
        userService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully");
    }
}