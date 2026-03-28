package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.security.CustomOAuth2User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

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
}
