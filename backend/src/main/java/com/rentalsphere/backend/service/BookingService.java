package com.rentalsphere.backend.service;

import com.rentalsphere.backend.dto.BookingRequest;
import com.rentalsphere.backend.model.Booking;
import com.rentalsphere.backend.model.Vehicle;
import com.rentalsphere.backend.repository.BookingRepository;
import com.rentalsphere.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final com.rentalsphere.backend.repository.UserRepository userRepository;

    // ✅ 1️⃣ CREATE BOOKING
    public Booking createBooking(BookingRequest request) {

        // ✅ Get vehicle
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (!vehicle.isAvailable()) {
            throw new RuntimeException("Vehicle not available");
        }

        // ✅ Generate Booking ID
        String bookingId = "B" + System.currentTimeMillis();

        // ✅ Calculate days (Inclusive of start day)
        long days = ChronoUnit.DAYS.between(
                request.getStartDate(),
                request.getEndDate()
        ) + 1;

        if (days <= 0) {
            throw new RuntimeException("Invalid booking duration");
        }
        
        if (request.getStartDate().isBefore(java.time.LocalDate.now())) {
            throw new RuntimeException("Cannot book vehicles in the past");
        }

        // ✅ Check overlapping finalized dates
        boolean isOverlappingFinalized = bookingRepository.findAll().stream()
                .filter(b -> b.getVehicleId().equals(request.getVehicleId()))
                .filter(b -> "APPROVED".equals(b.getStatus()) || "COMPLETED".equals(b.getStatus()))
                .anyMatch(b -> 
                    !request.getStartDate().isAfter(b.getEndDate()) && 
                    !request.getEndDate().isBefore(b.getStartDate())
                );

        if (isOverlappingFinalized) {
            throw new RuntimeException("This vehicle has already been approved for another user on these dates.");
        }

        // ✅ Calculate total amount
        double totalAmount = days * vehicle.getPricePerDay();

        // ✅ Create booking
        Booking booking = Booking.builder()
                .bookingId(bookingId)
                .userId(request.getUserId())
                .vehicleId(request.getVehicleId())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalAmount(totalAmount)
                .status("CREATED")
                .billStatus("PENDING")
                .build();

        return bookingRepository.save(booking);
    }

    // ✅ 2️⃣ REQUEST PAYMENT
    public String requestPayment(String bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // ✅ Ensure bill is generated first
        if (!"GENERATED".equals(booking.getBillStatus())) {
            throw new RuntimeException("Bill not generated yet");
        }

        return "Payment request sent successfully";
    }

    // ✅ 3️⃣ GET BOOKING HISTORY
    public List<com.rentalsphere.backend.dto.BookingResponse> getHistory(Long userId) {
        return bookingRepository.findByUserId(userId).stream().map(this::mapToResponse).toList();
    }

    // ✅ 4️⃣ GET ALL BOOKINGS (Admin)
    public List<com.rentalsphere.backend.dto.BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    // ✅ GET ALL BOOKINGS FOR ADMIN'S VEHICLES
    public List<com.rentalsphere.backend.dto.BookingResponse> getAllBookingsByAdminId(Long adminId) {
        return bookingRepository.findAll().stream()
                .filter(b -> {
                    Vehicle v = vehicleRepository.findById(b.getVehicleId()).orElse(null);
                    return v != null && adminId.equals(v.getAdminId());
                })
                .map(this::mapToResponse)
                .toList();
    }

    // ✅ GET SINGLE BOOKING
    public com.rentalsphere.backend.dto.BookingResponse getBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponse(booking);
    }

    private com.rentalsphere.backend.dto.BookingResponse mapToResponse(Booking b) {
        com.rentalsphere.backend.model.User u = userRepository.findById(b.getUserId()).orElse(null);
        Vehicle v = vehicleRepository.findById(b.getVehicleId()).orElse(null);
        return com.rentalsphere.backend.dto.BookingResponse.builder()
                .bookingId(b.getBookingId())
                .userId(b.getUserId())
                .userName(u != null ? u.getFullName() : "Unknown")
                .userMobile(u != null ? u.getMobile() : "Unknown")
                .vehicleId(b.getVehicleId())
                .vehicleDetails(v != null ? (v.getType() + " - " + v.getBrand() + " (" + v.getRegistrationNumber() + ")") : "Unknown")
                .startDate(b.getStartDate())
                .endDate(b.getEndDate())
                .totalAmount(b.getTotalAmount())
                .status(b.getStatus())
                .billStatus(b.getBillStatus())
                .build();
    }

    // ✅ 5️⃣ CANCEL BOOKING
    public String cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!"CREATED".equals(booking.getStatus())) {
            throw new RuntimeException("Only CREATED bookings can be cancelled");
        }

        // Delete booking completely
        bookingRepository.delete(booking);

        return "Booking cancelled successfully";
    }
}