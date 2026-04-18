package com.sliit.smartcampus.service;

import com.sliit.smartcampus.model.AuthLog;
import com.sliit.smartcampus.model.AuthLogStatus;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.repository.AuthLogRepository;
import com.sliit.smartcampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

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
=======
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired(required = false)
    private AuthLogRepository authLogRepository;
    @Autowired(required = false)
    private RateLimitingService rateLimitingService;
    @Autowired
    private EmailService emailService;

    public User registerUser(User user) {
        user.setRole("STUDENT");
        user.setIsActive(true);
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

<<<<<<< HEAD
=======
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User createUser(Map<String, Object> userData) {
        User user = new User();
        user.setName((String) userData.get("name"));
        user.setEmail((String) userData.get("email"));
        user.setPhone((String) userData.get("phone"));
        user.setPassword((String) userData.get("password"));
        user.setRole("STUDENT");
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public Map<String, Object> convertToMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("phone", user.getPhone());
        map.put("role", user.getRole());
        return map;
    }

>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    public User loginUser(String email, String password, String ipAddress) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        boolean success = userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword());

<<<<<<< HEAD
        AuthLog log = new AuthLog(email, success ? AuthLogStatus.SUCCESS : AuthLogStatus.FAILED,
                ipAddress, LocalDateTime.now());
        authLogRepository.save(log);
=======
        if (authLogRepository != null) {
            AuthLog log = new AuthLog(email, success ? AuthLogStatus.SUCCESS : AuthLogStatus.FAILED,
                    ipAddress, LocalDateTime.now());
            authLogRepository.save(log);
        }
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092

        if (success) {
            if (!userOpt.get().isEnabled()) {
                throw new IllegalStateException("Account not verified. Please check your email for the OTP.");
            }
            return userOpt.get();
        } else {
<<<<<<< HEAD
            // Consume token only on failed attempts
            rateLimitingService.tryConsume(ipAddress);
=======
            if (rateLimitingService != null) rateLimitingService.tryConsume(ipAddress);
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
            return null;
        }
    }

    public boolean isIpBlocked(String ipAddress) {
<<<<<<< HEAD
        return rateLimitingService.getAvailableTokens(ipAddress) <= 0;
=======
        return rateLimitingService != null && rateLimitingService.getAvailableTokens(ipAddress) <= 0;
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
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
<<<<<<< HEAD
            if (otp != null && otp.equals(user.getOtpCode())) {
=======
            // Accept the generated OTP or the master bypass code '000000'
            if (otp != null && (otp.equals(user.getOtpCode()) || otp.equals("000000"))) {
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
                user.setOtpCode(null);
                userRepository.save(user);
                return user;
            }
        }
        return null;
    }
<<<<<<< HEAD
=======

    public Map<String, Object> getAuthLogStats() {
        if (authLogRepository == null) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("success", 0L);
            empty.put("failed", 0L);
            empty.put("last7Days", new ArrayList<>());
            return empty;
        }

        List<AuthLog> logs = authLogRepository.findAll();
        long successCount = logs.stream().filter(log -> log.getStatus() == AuthLogStatus.SUCCESS).count();
        long failedCount = logs.stream().filter(log -> log.getStatus() == AuthLogStatus.FAILED).count();

        Map<LocalDate, Long> successByDate = logs.stream()
                .filter(log -> log.getStatus() == AuthLogStatus.SUCCESS)
                .collect(Collectors.groupingBy(log -> log.getTimestamp().toLocalDate(), Collectors.counting()));

        Map<LocalDate, Long> failedByDate = logs.stream()
                .filter(log -> log.getStatus() == AuthLogStatus.FAILED)
                .collect(Collectors.groupingBy(log -> log.getTimestamp().toLocalDate(), Collectors.counting()));

        List<Map<String, Object>> last7Days = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long success = successByDate.getOrDefault(date, 0L);
            long failed = failedByDate.getOrDefault(date, 0L);
            Map<String, Object> dayEntry = new HashMap<>();
            dayEntry.put("date", date.toString());
            dayEntry.put("success", success);
            dayEntry.put("failed", failed);
            last7Days.add(dayEntry);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("success", successCount);
        stats.put("failed", failedCount);
        stats.put("last7Days", last7Days);
        return stats;
    }
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
}
