package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStudentEmail(String studentEmail);
    List<Booking> findByStatus(String status);
    List<Booking> findByStatusOrderByCreatedAtAsc(String status);
    List<Booking> findByResource(com.sliit.smartcampus.model.Resource resource);
    Optional<Booking> findByBookingReference(String bookingReference);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b WHERE b.resource = :resource " +
            "AND b.bookingDate = :date AND b.status = 'APPROVED' AND (" +
            "(b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(com.sliit.smartcampus.model.Resource resource, java.time.LocalDate date, java.time.LocalTime startTime, java.time.LocalTime endTime);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'APPROVED' AND CAST(b.approvedAt AS date) = CAST(GETDATE() AS date)")
    long countApprovedToday();
}
