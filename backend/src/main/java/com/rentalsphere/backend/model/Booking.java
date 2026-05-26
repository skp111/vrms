package com.rentalsphere.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    // ✅ Unique Booking ID (String used across system)
    @Id
    @Column(nullable = false, unique = true)
    private String bookingId;

    // ✅ Link with User (Person 1)
    private Long userId;

    // ✅ Link with Vehicle (Person 2)
    private Long vehicleId;

    // ✅ Booking duration
    private LocalDate startDate;
    private LocalDate endDate;

    // ✅ Total rent calculated
    private double totalAmount;

    // ✅ Booking lifecycle status
    // CREATED → COMPLETED → CANCELLED
    private String status;

    // ✅ Billing status (Admin controlled)
    // PENDING → GENERATED
    private String billStatus;
}