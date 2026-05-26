package com.rentalsphere.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Full Name (Used in UI + profile)
    @Column(nullable = false)
    private String fullName;

    // ✅ Unique Email (Login credential)
    @Column(nullable = false, unique = true)
    private String email;

    // ✅ Encrypted password
    @Column(nullable = false)
    private String password;

    // ✅ Optional contact details
    private String mobile;
    private String address;

    // ✅ Driving license (important for rental)
    private String licenseNumber;

    // ✅ Role (USER / ADMIN)
    @Enumerated(EnumType.STRING)
    private Role role;

}