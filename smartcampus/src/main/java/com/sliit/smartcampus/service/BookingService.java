package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.Booking;
<<<<<<< HEAD
import com.sliit.smartcampus.repository.BookingRepository;
import com.sliit.smartcampus.repository.UserRepository;
import com.sliit.smartcampus.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository, 
                          NotificationService notificationService,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public Booking createBooking(Booking booking) {
        if (booking.getStatus() == null) {
            booking.setStatus("PENDING");
        }
        Booking savedBooking = bookingRepository.save(booking);
        
        // Notify the user that their booking request was received
        sendBookingNotification(savedBooking, "Your booking request for " + savedBooking.getResourceName() + " has been received! 📅");
        
        return savedBooking;
    }

    public List<Booking> getMyBookings(String email) {
        return bookingRepository.findByUserEmail(email);
    }
=======
import com.sliit.smartcampus.model.Resource;
import com.sliit.smartcampus.repository.BookingRepository;
import com.sliit.smartcampus.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

<<<<<<< HEAD
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    private void sendBookingNotification(Booking booking, String message) {
        Optional<User> userOpt = userRepository.findByEmail(booking.getUserEmail());
        if (userOpt.isPresent()) {
            notificationService.createNotification(userOpt.get().getId(), message);
        }
=======
    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatusOrderByCreatedAtAsc("PENDING");
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByStudentEmail(email);
    }

    public Booking createBooking(Map<String, Object> requestData) {
        Long resourceId = Long.parseLong(requestData.get("resourceId").toString());

        Resource resource = resourceRepository.findById(resourceId).orElse(null);
        if (resource == null) return null;

        LocalDate bookingDate = LocalDate.parse(requestData.get("bookingDate").toString());
        LocalTime startTime = LocalTime.parse(requestData.get("startTime").toString());
        LocalTime endTime = LocalTime.parse(requestData.get("endTime").toString());

        // Validate time
        if (endTime.isBefore(startTime) || endTime.equals(startTime)) {
            throw new RuntimeException("End time must be after start time");
        }

        // Check duration (max 2 hours)
        long durationMinutes = java.time.Duration.between(startTime, endTime).toMinutes();
        if (durationMinutes > 120) {
            throw new RuntimeException("Booking cannot exceed 2 hours");
        }
        if (durationMinutes < 30) {
            throw new RuntimeException("Minimum booking duration is 30 minutes");
        }

        // Check conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(resource, bookingDate, startTime, endTime);
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Time slot conflicts with existing booking");
        }

        Booking booking = new Booking();
        booking.setResource(resource);

        // Set student info directly
        booking.setStudentName(requestData.get("studentName") != null ? requestData.get("studentName").toString() : "Guest");
        booking.setStudentEmail(requestData.get("studentEmail") != null ? requestData.get("studentEmail").toString() : "guest@campus.edu");
        booking.setStudentPhone(requestData.get("studentPhone") != null ? requestData.get("studentPhone").toString() : "");

        booking.setBookingDate(bookingDate);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setPurpose(requestData.get("purpose").toString());
        booking.setStatus("PENDING");

        if (requestData.get("attendees") != null) {
            booking.setAttendees(Integer.parseInt(requestData.get("attendees").toString()));
        }

        if (requestData.get("specialRequests") != null) {
            booking.setSpecialRequests(requestData.get("specialRequests").toString());
        }

        return bookingRepository.save(booking);
    }

    public Booking approveBooking(Long id, String adminName) {
        Booking booking = getBookingById(id);
        if (booking == null) return null;

        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Only pending bookings can be approved");
        }

        booking.setStatus("APPROVED");
        booking.setApprovedBy(adminName);
        booking.setApprovedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long id, String adminName, String reason) {
        Booking booking = getBookingById(id);
        if (booking == null) return null;

        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("Only pending bookings can be rejected");
        }

        booking.setStatus("REJECTED");
        booking.setRejectedBy(adminName);
        booking.setRejectedAt(LocalDateTime.now());
        booking.setRejectionReason(reason);

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id, String cancelledBy) {
        Booking booking = getBookingById(id);
        if (booking == null) return null;

        booking.setStatus("CANCELLED");
        booking.setCancelledBy(cancelledBy);
        booking.setCancelledAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public Map<String, Object> convertToMap(Booking booking) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", booking.getId());
        map.put("bookingReference", booking.getBookingReference());
        map.put("resourceId", booking.getResource().getId());
        map.put("resourceName", booking.getResource().getName());
        map.put("resourceImage", booking.getResource().getImages() != null && !booking.getResource().getImages().isEmpty() ?
                booking.getResource().getImages().get(0) : null);
        map.put("resourceType", booking.getResource().getType());
        map.put("studentName", booking.getStudentName());
        map.put("studentEmail", booking.getStudentEmail());
        map.put("studentPhone", booking.getStudentPhone());
        map.put("bookingDate", booking.getBookingDate().toString());
        map.put("startTime", booking.getStartTime().toString());
        map.put("endTime", booking.getEndTime().toString());
        map.put("purpose", booking.getPurpose());
        map.put("status", booking.getStatus());
        map.put("attendees", booking.getAttendees());
        map.put("specialRequests", booking.getSpecialRequests());
        map.put("rejectionReason", booking.getRejectionReason());
        map.put("approvedBy", booking.getApprovedBy());
        map.put("approvedAt", booking.getApprovedAt());
        map.put("createdAt", booking.getCreatedAt());
        return map;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", bookingRepository.count());
        stats.put("pendingApprovals", (long) bookingRepository.findByStatus("PENDING").size());
        stats.put("approvedToday", bookingRepository.countApprovedToday());
        stats.put("activeResources", (long) resourceRepository.findByStatus("ACTIVE").size());
        stats.put("totalRevenue", 0L);
        stats.put("satisfactionRate", 98);
        return stats;
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }
}
