package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.model.Booking;
import com.sliit.smartcampus.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        List<Map<String, Object>> bookingMaps = bookings.stream()
                .map(bookingService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", bookingMaps);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPendingBookings() {
        List<Booking> bookings = bookingService.getPendingBookings();
        List<Map<String, Object>> bookingMaps = bookings.stream()
                .map(bookingService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", bookingMaps);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getBookingsByEmail(@PathVariable String email) {
        List<Booking> bookings = bookingService.getBookingsByEmail(email);
        List<Map<String, Object>> bookingMaps = bookings.stream()
                .map(bookingService::convertToMap)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", bookingMaps);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Booking not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", bookingService.convertToMap(booking));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Map<String, Object> requestData) {
        try {
            System.out.println("Creating booking: " + requestData);
            Booking booking = bookingService.createBooking(requestData);

            if (booking == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Resource not found");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking created successfully");
            response.put("data", bookingService.convertToMap(booking));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> approveBooking(
            @PathVariable Long id,
            @RequestParam(defaultValue = "Admin") String adminName) {
        try {
            Booking booking = bookingService.approveBooking(id, adminName);
            if (booking == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Booking not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking approved successfully");
            response.put("data", bookingService.convertToMap(booking));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> rejectBooking(
            @PathVariable Long id,
            @RequestParam(defaultValue = "Admin") String adminName,
            @RequestParam String reason) {
        try {
            Booking booking = bookingService.rejectBooking(id, adminName, reason);
            if (booking == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Booking not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking rejected successfully");
            response.put("data", bookingService.convertToMap(booking));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> cancelBooking(
            @PathVariable Long id,
            @RequestParam(defaultValue = "User") String cancelledBy) {
        try {
            Booking booking = bookingService.cancelBooking(id, cancelledBy);
            if (booking == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Booking not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking cancelled successfully");
            response.put("data", bookingService.convertToMap(booking));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = bookingService.getDashboardStats();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", stats);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyBookings(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
