package com.rentalsphere.backend.controller;

import com.rentalsphere.backend.dto.BookingRequest;
import com.rentalsphere.backend.model.Booking;
import com.rentalsphere.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ✅ CREATE BOOKING
    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest request) {
        return bookingService.createBooking(request);
    }

    // ✅ REQUEST PAYMENT (after bill is generated)
    @PostMapping("/{bookingId}/payment")
    public String requestPayment(@PathVariable String bookingId) {
        return bookingService.requestPayment(bookingId);
    }

    // ✅ GET BOOKING HISTORY
    @GetMapping("/history/{userId}")
    public List<com.rentalsphere.backend.dto.BookingResponse> getHistory(@PathVariable Long userId) {
        return bookingService.getHistory(userId);
    }

    // ✅ GET ALL BOOKINGS (Admin)
    @GetMapping("/all")
    public List<com.rentalsphere.backend.dto.BookingResponse> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // ✅ GET ALL BOOKINGS FOR SPECIFIC ADMIN
    @GetMapping("/admin/{adminId}")
    public List<com.rentalsphere.backend.dto.BookingResponse> getAllBookingsByAdminId(@PathVariable Long adminId) {
        return bookingService.getAllBookingsByAdminId(adminId);
    }

    // ✅ GET BOOKING BY ID
    @GetMapping("/{bookingId}")
    public com.rentalsphere.backend.dto.BookingResponse getBooking(@PathVariable String bookingId) {
        return bookingService.getBooking(bookingId);
    }

    // ✅ CANCEL BOOKING
    @PutMapping("/{bookingId}/cancel")
    public String cancelBooking(@PathVariable String bookingId) {
        return bookingService.cancelBooking(bookingId);
    }
}