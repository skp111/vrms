package com.rentalsphere.backend.repository;

import com.rentalsphere.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    // ✅ Find vehicle by registration number (for duplicate check)
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);

    // ✅ Get only available vehicles (better than filtering in controller)
    List<Vehicle> findByAvailableTrue();
}