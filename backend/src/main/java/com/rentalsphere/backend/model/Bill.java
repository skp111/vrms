package com.rentalsphere.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Link with Booking
    @Column(nullable = false, unique = true)
    private String bookingId;

    // ✅ Final amount after all calculations
    private double finalAmount;
}