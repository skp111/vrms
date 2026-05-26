package com.rentalsphere.backend.controller;

import com.rentalsphere.backend.model.Payment;
import com.rentalsphere.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final com.rentalsphere.backend.repository.UserRepository userRepository;

    // ✅ GET ADMIN CONTACT
    @GetMapping("/admin-contact")
    public java.util.Map<String, String> getAdminContact() {
        return userRepository.findFirstByRole(com.rentalsphere.backend.model.Role.ADMIN)
                .map(admin -> java.util.Map.of("mobile", admin.getMobile() != null ? admin.getMobile() : "N/A"))
                .orElse(java.util.Map.of("mobile", "Not Assigned"));
    }

    // ✅ REQUEST PAYMENT (User action)
    @PostMapping("/request/{bookingId}")
    public String requestPayment(@PathVariable String bookingId) {
        return paymentService.requestPayment(bookingId);
    }

    // ✅ GET PAYMENT DETAILS (User/Admin view)
    @GetMapping("/{bookingId}")
    public Payment getPayment(@PathVariable String bookingId) {
        return paymentService.getPayment(bookingId);
    }

    // ✅ PROCESS PAYMENT DIRECTLY (User action)
    @PostMapping("/process/{bookingId}")
    public Payment processPayment(@PathVariable String bookingId) {
        return paymentService.processPayment(bookingId);
    }
}