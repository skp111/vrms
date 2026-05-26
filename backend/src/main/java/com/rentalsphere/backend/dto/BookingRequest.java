package com.rentalsphere.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BookingRequest {

    // ✅ User ID (from login / JWT)
    private Long userId;

    // ✅ Selected vehicle ID
    private Long vehicleId;

    // ✅ Booking start date
    private LocalDate startDate;

    // ✅ Booking end date
    private LocalDate endDate;
}