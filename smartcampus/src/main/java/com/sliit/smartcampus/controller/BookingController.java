package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.model.Booking;
import com.sliit.smartcampus.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
<<<<<<< HEAD
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
=======
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
@CrossOrigin(origins = "http://localhost:3000")
>>>>>>> Stashed changes
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

<<<<<<< Updated upstream
    @PostMapping("/create")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking, Authentication authentication) {
        booking.setUserEmail(authentication.getName());
        return ResponseEntity.ok(bookingService.createBooking(booking));
=======
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
=======
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
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
<<<<<<< HEAD
    @PreAuthorize("hasRole('ADMIN')")
=======
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
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

<<<<<<< HEAD
    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
=======
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
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
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
<<<<<<< HEAD
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

=======
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Map<String, Object> requestData) {
        try {
            Booking booking = bookingService.createBooking(requestData);
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking created successfully");
            response.put("data", bookingService.convertToMap(booking));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
<<<<<<< HEAD

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
        } catch (RuntimeException e) {
=======
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
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

<<<<<<< HEAD
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
        } catch (RuntimeException e) {
=======
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
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

<<<<<<< HEAD
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> cancelBooking(
            @PathVariable Long id,
            @RequestParam(defaultValue = "User") String cancelledBy) {
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
    }

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = bookingService.getDashboardStats();

=======
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
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", stats);
        return ResponseEntity.ok(response);
>>>>>>> Stashed changes
    }
<<<<<<< HEAD

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyBookings(authentication.getName()));
    }
<<<<<<< Updated upstream

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
=======
=======
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
>>>>>>> Stashed changes
}
