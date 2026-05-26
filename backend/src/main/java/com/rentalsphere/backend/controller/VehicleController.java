package com.rentalsphere.backend.controller;

import com.rentalsphere.backend.model.Vehicle;
import com.rentalsphere.backend.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    // ✅ 1️⃣ ADD VEHICLE (ADMIN)
    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.addVehicle(vehicle);
    }

    // ✅ 2️⃣ GET ALL VEHICLES (USER + ADMIN)
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAll();
    }

    // ✅ GET VEHICLES BY ADMIN ID
    @GetMapping("/admin/{adminId}")
    public List<Vehicle> getVehiclesByAdminId(@PathVariable Long adminId) {
        return vehicleService.getAllByAdminId(adminId);
    }

    // ✅ 3️⃣ GET ONLY AVAILABLE VEHICLES (USED IN BOOKING)
    @GetMapping("/available")
    public List<Vehicle> getAvailableVehicles() {
        return vehicleService.getAll()
                .stream()
                .filter(Vehicle::isAvailable)
                .toList();
    }

    // ✅ 4️⃣ GET VEHICLE BY ID (OPTIONAL BUT RECOMMENDED)
    @GetMapping("/{id}")
    public Vehicle getVehicleById(@PathVariable Long id) {
        return vehicleService.getAll()
                .stream()
                .filter(v -> v.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    // ✅ 5️⃣ UPDATE VEHICLE (ADMIN)
    @PutMapping("/{id}")
    public Vehicle updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle
    ) {
        return vehicleService.update(id, vehicle);
    }

    // ✅ 6️⃣ DELETE VEHICLE (ADMIN)
    @DeleteMapping("/{id}")
    public String deleteVehicle(@PathVariable Long id) {
        vehicleService.delete(id);
        return "Vehicle deleted successfully";
    }
}