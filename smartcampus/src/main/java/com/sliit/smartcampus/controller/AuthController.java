package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.security.CustomOAuth2User;
import com.sliit.smartcampus.dto.VerifyRequest;
import com.sliit.smartcampus.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for handling user authentication and MFA processes.
 * Integrates with Spring Security OAuth2 and generates JWTs.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/success")
    public Map<String, Object> loginSuccess(@RequestParam(required = false) String token) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        
        if (auth != null && auth.getPrincipal() instanceof CustomOAuth2User) {
            CustomOAuth2User user = (CustomOAuth2User) auth.getPrincipal();
            response.put("status", "Login Successful! 🎉");
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", auth.getAuthorities().toString());
            response.put("jwt_token", token);
            response.put("message", "You are now authenticated correctly in the Smart Campus system.");
        } else {
            response.put("status", "Authentication Found!");
            response.put("details", "Token is " + (token != null ? "Present" : "Missing"));
            response.put("help", "If you see this, redirect from Google happened correctly. Check the URL for the 'token' parameter.");
        }
        
        return response;
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody VerifyRequest request) {
        boolean isVerified = userService.verifyUser(request.getEmail(), request.getOtp());
        Map<String, String> response = new HashMap<>();

        if (isVerified) {
            response.put("status", "success");
            response.put("message", "Email verified successfully. You can now log in.");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "Invalid OTP or User not found.");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
