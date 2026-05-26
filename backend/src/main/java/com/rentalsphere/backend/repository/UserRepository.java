package com.rentalsphere.backend.repository;

import com.rentalsphere.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Find user by email (USED IN LOGIN)
    Optional<User> findByEmail(String email);

    // ✅ Find Admin User
    Optional<User> findFirstByRole(com.rentalsphere.backend.model.Role role);

    // ✅ Check if email already exists (USED IN REGISTER)
    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);
    boolean existsByLicenseNumber(String licenseNumber);
}