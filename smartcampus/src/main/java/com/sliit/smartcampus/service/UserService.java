package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.AuthLog;
import com.sliit.smartcampus.model.AuthLogStatus;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.repository.AuthLogRepository;
import com.sliit.smartcampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

/**
 * Service class handling core User business logic.
 * Manages user registration, role provisioning, and password encryption via BCrypt.
 * Uses RateLimitingService to mitigate brute-force attempts.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthLogRepository authLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final RateLimitingService rateLimitingService;
    private final EmailService emailService;

    @Autowired
    public UserService(UserRepository userRepository, AuthLogRepository authLogRepository,
                       PasswordEncoder passwordEncoder, RateLimitingService rateLimitingService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.authLogRepository = authLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.rateLimitingService = rateLimitingService;
        this.emailService = emailService;
    }

    public User registerUser(User user) {
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(false);
        
        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtpCode(otp);
        
        User savedUser = userRepository.save(user);

        // Send Email asynchronously
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            emailService.sendOtpEmail(savedUser.getEmail(), otp);
        });

        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User loginUser(String email, String password, String ipAddress) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        boolean success = userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword());

        try {
            AuthLog log = new AuthLog(email, success ? AuthLogStatus.SUCCESS : AuthLogStatus.FAILED,
                    ipAddress, LocalDateTime.now());
            authLogRepository.save(log);
        } catch (Exception e) {
            // Log the error locally but don't crash the login
            System.err.println("AuthLog save failed: " + e.getMessage());
        }

        if (success) {
            if (!userOpt.get().isEnabled()) {
                throw new IllegalStateException("Account not verified. Please check your email for the OTP.");
            }
            return userOpt.get();
        } else {
            // Consume token only on failed attempts
            rateLimitingService.tryConsume(ipAddress);
            return null;
        }
    }

    public boolean isIpBlocked(String ipAddress) {
        return rateLimitingService.getAvailableTokens(ipAddress) <= 0;
    }

    public void processMfaLogin(User user) {
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setOtpCode(otp);
        userRepository.save(user);

        java.util.concurrent.CompletableFuture.runAsync(() -> {
            emailService.sendLoginMfaEmail(user.getEmail(), otp);
        });
    }

    public boolean verifyUser(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (otp != null && otp.equals(user.getOtpCode())) {
                user.setEnabled(true);
                user.setOtpCode(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    public User verifyMfaLogin(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (otp != null && otp.equals(user.getOtpCode())) {
                user.setOtpCode(null);
                userRepository.save(user);
                return user;
            }
        }
        return null;
    }
}
