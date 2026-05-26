package com.rentalsphere.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillResponse {
    private Long id;
    private String bookingId;
    private double finalAmount;
    
    // User Details
    private String userName;
    private String userMobile;
    
    // Vehicle Details
    private String vehicleDetails;
    
    // Payment Details
    private String paymentStatus;
}
