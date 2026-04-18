package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.model.Booking;
import com.sliit.smartcampus.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
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

    @GetMapping("/user/{email}")
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

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Map<String, Object> requestData) {
        try {
            Booking booking = bookingService.createBooking(requestData);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking created successfully");
            response.put("data", bookingService.convertToMap(booking));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveBooking(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String adminName = body.getOrDefault("adminName", "Administrator");
            Booking booking = bookingService.approveBooking(id, adminName);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking approved");
            response.put("data", bookingService.convertToMap(booking));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectBooking(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String adminName = body.getOrDefault("adminName", "Administrator");
            String reason = body.getOrDefault("reason", "No reason provided");
            Booking booking = bookingService.rejectBooking(id, adminName, reason);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking rejected");
            response.put("data", bookingService.convertToMap(booking));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String user = body.getOrDefault("user", "User");
            Booking booking = bookingService.cancelBooking(id, user);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking cancelled");
            response.put("data", bookingService.convertToMap(booking));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = bookingService.getDashboardStats();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", stats);
        return ResponseEntity.ok(response);
    }
}
