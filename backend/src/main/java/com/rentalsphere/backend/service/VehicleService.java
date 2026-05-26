package com.rentalsphere.backend.service;

import com.rentalsphere.backend.model.Vehicle;
import com.rentalsphere.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final com.rentalsphere.backend.repository.BookingRepository bookingRepository;
    private final com.rentalsphere.backend.repository.BillRepository billRepository;
    private final com.rentalsphere.backend.repository.PaymentRepository paymentRepository;

    // ✅ 1️⃣ ADD VEHICLE (ADMIN)
    public Vehicle addVehicle(Vehicle vehicle) {

        // Ensure unique registration number
        if (vehicleRepository.findAll().stream()
                .anyMatch(v -> v.getRegistrationNumber()
                        .equalsIgnoreCase(vehicle.getRegistrationNumber()))) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "This vehicle number is already registered");
        }

        vehicle.setAvailable(true); // default available
        return vehicleRepository.save(vehicle);
    }

    // ✅ 2️⃣ GET ALL VEHICLES
    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }

    // ✅ GET VEHICLES BY ADMIN ID
    public List<Vehicle> getAllByAdminId(Long adminId) {
        return vehicleRepository.findAll().stream()
                .filter(v -> adminId.equals(v.getAdminId()))
                .toList();
    }

    // ✅ 3️⃣ UPDATE VEHICLE (ADMIN)
    public Vehicle update(Long id, Vehicle updatedVehicle) {

        Vehicle existing = vehicleRepository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Vehicle not found"));

        boolean hasActiveBooking = bookingRepository.findAll().stream()
                .anyMatch(b -> b.getVehicleId().equals(id) && 
                        ("APPROVED".equals(b.getStatus()) || "COMPLETED".equals(b.getStatus())) &&
                        !b.getEndDate().isBefore(java.time.LocalDate.now()));
        
        if (hasActiveBooking) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Cannot edit a vehicle that has an active booking.");
        }

        existing.setType(updatedVehicle.getType());
        existing.setBrand(updatedVehicle.getBrand());
        existing.setModel(updatedVehicle.getModel());
        existing.setPricePerDay(updatedVehicle.getPricePerDay());
        existing.setAvailable(updatedVehicle.isAvailable());

        // Update registration number if it changed, ensuring no duplicates
        if (!existing.getRegistrationNumber().equalsIgnoreCase(updatedVehicle.getRegistrationNumber())) {
            boolean isTaken = vehicleRepository.findAll().stream()
                    .anyMatch(v -> v.getRegistrationNumber().equalsIgnoreCase(updatedVehicle.getRegistrationNumber()));
            if (isTaken) {
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "This vehicle number is already registered to another vehicle");
            }
            existing.setRegistrationNumber(updatedVehicle.getRegistrationNumber());
        }

        return vehicleRepository.save(existing);
    }

    // ✅ 4️⃣ DELETE VEHICLE (ADMIN)
    public void delete(Long id) {

        if (!vehicleRepository.existsById(id)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Vehicle not found");
        }

        boolean hasActiveBooking = bookingRepository.findAll().stream()
                .anyMatch(b -> b.getVehicleId().equals(id) && 
                        ("APPROVED".equals(b.getStatus()) || "COMPLETED".equals(b.getStatus())) &&
                        !b.getEndDate().isBefore(java.time.LocalDate.now()));

        if (hasActiveBooking) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Cannot delete a vehicle that has an active booking.");
        }

        // Delete all bookings related to this vehicle
        java.util.List<com.rentalsphere.backend.model.Booking> vehicleBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getVehicleId().equals(id))
                .toList();

        for (com.rentalsphere.backend.model.Booking b : vehicleBookings) {
            com.rentalsphere.backend.model.Bill bill = billRepository.findByBookingId(b.getBookingId());
            if (bill != null) {
                billRepository.delete(bill);
            }

            com.rentalsphere.backend.model.Payment payment = paymentRepository.findByBookingId(b.getBookingId());
            if (payment != null) {
                paymentRepository.delete(payment);
            }

            bookingRepository.delete(b);
        }

        vehicleRepository.deleteById(id);
    }
}