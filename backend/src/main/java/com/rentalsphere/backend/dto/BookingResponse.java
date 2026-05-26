package com.rentalsphere.backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String bookingId;
    private Long userId;
    private String userName;
    private String userMobile;
    private Long vehicleId;
    private String vehicleDetails; // e.g. "Car - Toyota Innova"
    private LocalDate startDate;
    private LocalDate endDate;
    private double totalAmount;
    private String status;
    private String billStatus;
}
