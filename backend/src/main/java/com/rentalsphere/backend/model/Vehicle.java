package com.rentalsphere.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles", uniqueConstraints = {
        @UniqueConstraint(columnNames = "registrationNumber")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Admin who owns this vehicle
    @Column(nullable = false)
    private Long adminId;

    // ✅ Vehicle type (Car, Bike, SUV)
    private String type;

    // ✅ Brand (Toyota, Honda, etc.)
    private String brand;

    // ✅ Model (Innova, City, etc.)
    private String model;

    // ✅ Unique vehicle registration number
    @Column(nullable = false, unique = true)
    private String registrationNumber;

    // ✅ Rental price per day
    private double pricePerDay;

    // ✅ Availability status (true = available)
    private boolean available;
}