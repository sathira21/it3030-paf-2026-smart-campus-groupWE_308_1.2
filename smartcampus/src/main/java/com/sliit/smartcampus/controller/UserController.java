package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.dto.LoginRequest;
import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
        if (user != null) {
            String token = tokenProvider.generateTokenFromUser(user);
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("user", user);
            response.put("jwt_token", token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
