package com.rentalsphere.backend.service;

import com.rentalsphere.backend.model.*;
import com.rentalsphere.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final BookingRepository bookingRepository;
    private final BillRepository billRepository;
    private final PaymentRepository paymentRepository;

    // ✅ 1️⃣ GENERATE BILL (ADMIN)
    public Bill generateBill(String bookingId) {

        // ✅ Get booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("GENERATED".equals(booking.getBillStatus())) {
            throw new RuntimeException("Bill already generated");
        }

        // ✅ Final amount
        double finalAmount = booking.getTotalAmount();

        // ✅ Create bill
        Bill bill = Bill.builder()
                .bookingId(booking.getBookingId())
                .finalAmount(finalAmount)
                .build();

        // ✅ Update booking
        booking.setBillStatus("GENERATED");
        bookingRepository.save(booking);

        return billRepository.save(bill);
    }

    // ✅ 2️⃣ VALIDATE PAYMENT (ADMIN)
    public Payment validatePayment(String bookingId, boolean approve) {

        Payment payment = paymentRepository.findByBookingId(bookingId);

        if (payment == null) {
            throw new RuntimeException("Payment not found");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (approve) {
            // ✅ Payment success
            payment.setStatus("SUCCESS");
            payment.setTransactionId("TXN" + System.currentTimeMillis());

            // ✅ COMPLETE BOOKING
            booking.setStatus("COMPLETED");

        } else {
            // ❌ Payment rejected
            payment.setStatus("REJECTED");
        }

        bookingRepository.save(booking);
        return paymentRepository.save(payment);
    }

    // ✅ 3️⃣ APPROVE BOOKING (ADMIN)
    public Booking approveBooking(String bookingId) {
        Booking approvedBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"CREATED".equals(approvedBooking.getStatus())) {
            throw new RuntimeException("Only CREATED bookings can be approved");
        }

        // ✅ Check overlapping finalized dates
        boolean isOverlappingFinalized = bookingRepository.findAll().stream()
                .filter(b -> !b.getBookingId().equals(bookingId))
                .filter(b -> b.getVehicleId().equals(approvedBooking.getVehicleId()))
                .filter(b -> "APPROVED".equals(b.getStatus()) || "COMPLETED".equals(b.getStatus()))
                .anyMatch(b -> 
                    !approvedBooking.getStartDate().isAfter(b.getEndDate()) && 
                    !approvedBooking.getEndDate().isBefore(b.getStartDate())
                );

        if (isOverlappingFinalized) {
            throw new RuntimeException("This vehicle has already been approved for another user on these dates.");
        }

        approvedBooking.setStatus("APPROVED");
        bookingRepository.save(approvedBooking);

        // Reject overlapping bookings
        java.util.List<Booking> allBookings = bookingRepository.findAll();
        for (Booking b : allBookings) {
            if (!b.getBookingId().equals(bookingId) 
                && b.getVehicleId().equals(approvedBooking.getVehicleId())
                && "CREATED".equals(b.getStatus())) {
                
                boolean overlaps = !approvedBooking.getStartDate().isAfter(b.getEndDate()) && 
                                   !approvedBooking.getEndDate().isBefore(b.getStartDate());
                if (overlaps) {
                    b.setStatus("REJECTED");
                    bookingRepository.save(b);
                }
            }
        }
        return approvedBooking;
    }

    // ✅ 4️⃣ REJECT BOOKING (ADMIN)
    public Booking rejectBooking(String bookingId) {
        Booking rejectedBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"CREATED".equals(rejectedBooking.getStatus())) {
            throw new RuntimeException("Only CREATED bookings can be manually rejected");
        }

        rejectedBooking.setStatus("REJECTED");
        return bookingRepository.save(rejectedBooking);
    }
}