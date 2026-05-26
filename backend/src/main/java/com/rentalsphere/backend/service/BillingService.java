package com.rentalsphere.backend.service;

import com.rentalsphere.backend.model.Bill;
import com.rentalsphere.backend.model.Booking;
import com.rentalsphere.backend.model.User;
import com.rentalsphere.backend.model.Vehicle;
import com.rentalsphere.backend.model.Payment;
import com.rentalsphere.backend.dto.BillResponse;
import com.rentalsphere.backend.repository.BillRepository;
import com.rentalsphere.backend.repository.BookingRepository;
import com.rentalsphere.backend.repository.UserRepository;
import com.rentalsphere.backend.repository.VehicleRepository;
import com.rentalsphere.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final BillRepository billRepository;
    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    // ✅ GET BILL BY BOOKING ID
    public Bill getBill(String bookingId) {

        Bill bill = billRepository.findByBookingId(bookingId);

        if (bill == null) {
            throw new RuntimeException("Bill not found for booking ID: " + bookingId);
        }

        return bill;
    }

    // ✅ GET ALL BILLS FOR ADMIN
    public List<BillResponse> getAllBillsByAdminId(Long adminId) {
        return billRepository.findAll().stream()
                .filter(bill -> {
                    Booking b = bookingRepository.findById(bill.getBookingId()).orElse(null);
                    if (b == null) return false;
                    Vehicle v = vehicleRepository.findById(b.getVehicleId()).orElse(null);
                    return v != null && adminId.equals(v.getAdminId());
                })
                .sorted(Comparator.comparing(Bill::getId).reversed())
                .map(this::mapToBillResponse)
                .toList();
    }

    private BillResponse mapToBillResponse(Bill bill) {
        Booking booking = bookingRepository.findById(bill.getBookingId()).orElse(null);
        String userName = "Unknown";
        String userMobile = "Unknown";
        String vehicleDetails = "Unknown";
        String paymentStatus = "PENDING";

        if (booking != null) {
            User user = userRepository.findById(booking.getUserId()).orElse(null);
            if (user != null) {
                userName = user.getFullName();
                userMobile = user.getMobile();
            }
            Vehicle vehicle = vehicleRepository.findById(booking.getVehicleId()).orElse(null);
            if (vehicle != null) {
                vehicleDetails = vehicle.getType() + " - " + vehicle.getBrand() + " (" + vehicle.getRegistrationNumber() + ")";
            }
            
            Payment payment = paymentRepository.findByBookingId(booking.getBookingId());
            if (payment != null) {
                if ("SUCCESS".equalsIgnoreCase(payment.getStatus())) {
                    paymentStatus = "COMPLETED";
                } else {
                    paymentStatus = payment.getStatus().toUpperCase();
                }
            }
        }

        return BillResponse.builder()
                .id(bill.getId())
                .bookingId(bill.getBookingId())
                .finalAmount(bill.getFinalAmount())
                .userName(userName)
                .userMobile(userMobile)
                .vehicleDetails(vehicleDetails)
                .paymentStatus(paymentStatus)
                .build();
    }
}