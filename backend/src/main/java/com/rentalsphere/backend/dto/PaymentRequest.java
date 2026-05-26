package com.rentalsphere.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {

    // ✅ Booking ID for which payment is requested
    private String bookingId;

    // ✅ Optional: Payment mode (UPI, CARD, CASH)
    private String paymentMode;
}
