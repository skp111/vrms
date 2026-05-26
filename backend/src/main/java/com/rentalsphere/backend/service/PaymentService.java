package com.rentalsphere.backend.service;

import com.rentalsphere.backend.model.Booking;
import com.rentalsphere.backend.model.Payment;
import com.rentalsphere.backend.repository.BookingRepository;
import com.rentalsphere.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    // ✅ 1️⃣ REQUEST PAYMENT (USER ACTION)
    public String requestPayment(String bookingId) {

        // ✅ Get booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"APPROVED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking must be approved before payment");
        }
        if (!"GENERATED".equals(booking.getBillStatus())) {
            throw new RuntimeException("Bill must be generated before payment");
        }

        // ✅ Check if payment already exists
        Payment existing = paymentRepository.findByBookingId(bookingId);

        if (existing != null) {
            return "Payment already requested";
        }

        // ✅ Create new payment
        Payment payment = Payment.builder()
                .bookingId(bookingId)
                .amount(booking.getTotalAmount()) // ✅ base amount (final calculated in bill)
                .status("PENDING")
                .build();

        paymentRepository.save(payment);

        return "Payment request created (Pending approval)";
    }

    // ✅ 2️⃣ GET PAYMENT DETAILS
    public Payment getPayment(String bookingId) {

        Payment payment = paymentRepository.findByBookingId(bookingId);

        if (payment == null) {
            throw new RuntimeException("Payment not found for booking ID: " + bookingId);
        }

        return payment;
    }

    // ✅ 3️⃣ PROCESS PAYMENT DIRECTLY (USER ACTION)
    public Payment processPayment(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!"APPROVED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking must be approved before payment");
        }
        if (!"GENERATED".equals(booking.getBillStatus())) {
            throw new RuntimeException("Bill must be generated before payment");
        }
        
        Payment payment = paymentRepository.findByBookingId(bookingId);
        if (payment == null) {
            payment = Payment.builder()
                .bookingId(bookingId)
                .amount(booking.getTotalAmount())
                .status("PENDING")
                .build();
        }

        payment.setStatus("SUCCESS");
        payment.setTransactionId("TXN" + System.currentTimeMillis());
        paymentRepository.save(payment);

        booking.setStatus("COMPLETED");
        bookingRepository.save(booking);

        return payment;
    }
}