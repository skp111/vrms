package com.rentalsphere.backend.repository;

import com.rentalsphere.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
	List<Booking> findByUserId(Long userId );
}