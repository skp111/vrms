package com.rentalsphere.backend.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Link with Booking
    @Column(nullable = false)
    private String bookingId;

    // ✅ Total amount to pay (from Bill)
    private double amount;

    // ✅ Payment status (admin-controlled)
    // PENDING → SUCCESS / REJECTED
    private String status;

    // ✅ Generated only when payment approved
    private String transactionId;
}