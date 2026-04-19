package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.dto.LoginRequest;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final com.sliit.smartcampus.security.JwtTokenProvider tokenProvider;

    @Autowired
    public UserController(UserService userService, com.sliit.smartcampus.security.JwtTokenProvider tokenProvider) {
        this.userService = userService;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();

        // Check if IP is already blocked
        if (userService.isIpBlocked(ipAddress)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many attempts. Account locked for 15 minutes.");
        }

        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword(), ipAddress);
            if (user != null) {
                // Check if user is Admin - trigger MFA
                if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                    userService.processMfaLogin(user);
                    java.util.Map<String, String> mfaResponse = new java.util.HashMap<>();
                    mfaResponse.put("status", "MFA_REQUIRED");
                    mfaResponse.put("message", "A verification code has been sent to your email.");
                    return ResponseEntity.status(HttpStatus.ACCEPTED).body(mfaResponse);
                }

                // If not admin, issue token directly
                String token = tokenProvider.generateTokenFromUser(user);
                java.util.Map<String, Object> response = new java.util.HashMap<>();
                response.put("user", user);
                response.put("jwt_token", token);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping("/login/verify")
    public ResponseEntity<?> verifyMfaLogin(@RequestBody com.sliit.smartcampus.dto.VerifyRequest verifyRequest) {
        User user = userService.verifyMfaLogin(verifyRequest.getEmail(), verifyRequest.getOtp());
        if (user != null) {
            String token = tokenProvider.generateTokenFromUser(user);
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("user", user);
            response.put("jwt_token", token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OTP or expired session.");
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/auth-logs/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAuthLogStats() {
        return ResponseEntity.ok(userService.getAuthLogStats());
    }
}
