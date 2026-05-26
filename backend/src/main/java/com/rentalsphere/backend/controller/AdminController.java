package com.rentalsphere.backend.controller;

import com.rentalsphere.backend.model.Bill;
import com.rentalsphere.backend.model.Payment;
import com.rentalsphere.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ✅ GENERATE BILL (Admin action)
    @PostMapping("/generate-bill/{bookingId}")
    public Bill generateBill(
            @PathVariable String bookingId
    ) {
        return adminService.generateBill(bookingId);
    }

    // ✅ VALIDATE PAYMENT (Admin action)
    @PutMapping("/validate-payment/{bookingId}")
    public Payment validatePayment(
            @PathVariable String bookingId,
            @RequestParam boolean approve
    ) {
        return adminService.validatePayment(bookingId, approve);
    }

    // ✅ APPROVE BOOKING (Admin action)
    @PutMapping("/approve/{bookingId}")
    public com.rentalsphere.backend.model.Booking approveBooking(@PathVariable String bookingId) {
        return adminService.approveBooking(bookingId);
    }

    // ✅ REJECT BOOKING (Admin action)
    @PutMapping("/reject/{bookingId}")
    public com.rentalsphere.backend.model.Booking rejectBooking(@PathVariable String bookingId) {
        return adminService.rejectBooking(bookingId);
    }
}