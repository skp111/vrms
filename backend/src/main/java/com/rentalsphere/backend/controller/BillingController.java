package com.rentalsphere.backend.controller;

import com.rentalsphere.backend.model.Bill;
import com.rentalsphere.backend.dto.BillResponse;
import com.rentalsphere.backend.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    // ✅ GET BILL BY BOOKING ID (User view)
    @GetMapping("/{bookingId}")
    public Bill getBill(@PathVariable String bookingId) {
        return billingService.getBill(bookingId);
    }

    // ✅ GET ALL BILLS FOR ADMIN
    @GetMapping("/admin/{adminId}")
    public List<BillResponse> getBillsByAdmin(@PathVariable Long adminId) {
        return billingService.getAllBillsByAdminId(adminId);
    }
}
