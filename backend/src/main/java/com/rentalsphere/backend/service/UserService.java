package com.rentalsphere.backend.service;

import com.rentalsphere.backend.config.JwtService;
import com.rentalsphere.backend.dto.AuthResponse;
import com.rentalsphere.backend.dto.LoginRequest;
import com.rentalsphere.backend.dto.RegisterRequest;
import com.rentalsphere.backend.model.Role;
import com.rentalsphere.backend.model.User;
import com.rentalsphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // ✅ 1️⃣ REGISTER USER
    public void registerUser(RegisterRequest request) {

        // ✅ Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // ✅ Check duplicate mobile
        if (request.getMobile() != null && userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number already registered");
        }

        // ✅ Check duplicate license
        if (request.getLicenseNumber() != null && userRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new RuntimeException("Driving License already registered");
        }

        // ✅ Create user
        User user = User.builder()
                .fullName(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .mobile(request.getMobile())
                .address(request.getAddress())
                .licenseNumber(request.getLicenseNumber())
                .role(request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN") ? Role.ADMIN : Role.USER)
                .build();

        userRepository.save(user);
    }

    // ✅ 2️⃣ LOGIN USER
    public AuthResponse loginUser(LoginRequest request) {

        // ✅ Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // ✅ Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // ✅ Generate JWT
        String token = jwtService.generateToken(user);

        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                token
        );
    }

    // ✅ 3️⃣ GET USER DETAILS (for integration)
    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ 4️⃣ UPDATE PASSWORD
    public void updatePassword(Long userId, String newPassword) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // ✅ 5️⃣ UPDATE LICENSE
    public void updateLicense(Long userId, String license) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLicenseNumber(license);
        userRepository.save(user);
    }

    // ✅ 6️⃣ RESET PASSWORD (FORGOT PASSWORD)
    @Transactional
    public void resetPassword(com.rentalsphere.backend.dto.ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with this email"));

        if (!user.getMobile().equals(request.getMobile())) {
            throw new RuntimeException("Mobile number does not match our records for this email");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}