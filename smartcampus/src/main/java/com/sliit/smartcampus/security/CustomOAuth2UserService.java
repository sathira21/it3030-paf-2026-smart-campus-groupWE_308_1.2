package com.sliit.smartcampus.security;

import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
<<<<<<< HEAD

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
=======
    private final String clientSecret;

    public CustomOAuth2UserService(UserRepository userRepository, 
                                 @org.springframework.beans.factory.annotation.Value("${spring.security.oauth2.client.registration.google.client-secret:NOT_FOUND}") String clientSecret) {
        this.userRepository = userRepository;
        this.clientSecret = clientSecret;
    }

    @jakarta.annotation.PostConstruct
    public void verifyConfig() {
        if (clientSecret == null || "NOT_FOUND".equals(clientSecret) || "default_secret".equals(clientSecret)) {
            System.err.println(">> [OAuth] ⚠️ WARNING: Google Client Secret is NOT correctly loaded! Check secrets.properties.");
        } else {
            System.out.println(">> [OAuth] ✅ Google Client Secret loaded successfully.");
        }
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPassword(null); // OAuth users don't have a password
<<<<<<< HEAD
            
            // Assign ADMIN role if email matches specific criteria, otherwise USER
            if (email != null && email.endsWith("@admin.smartcampus.com")) {
                newUser.setRole("ADMIN");
            } else {
                newUser.setRole("USER");
=======

            // Assign ADMIN role if email matches specific criteria (CASE-INSENSITIVE)
            if (email != null && (email.toLowerCase().endsWith("@admin.smartcampus.com") ||
                    email.equalsIgnoreCase("udanten2@gmail.com") ||
                    email.equalsIgnoreCase("udenten2@gmail.com"))) {
                newUser.setRole("ADMIN");
            } else {
                newUser.setRole("STUDENT");
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
            }
            return userRepository.save(newUser);
        });

<<<<<<< HEAD
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole())
        );
=======
        // PERMANENT FIX: Force role update based on email for whitelisted accounts
        boolean modified = false;
        if (email != null) {
            String lowerEmail = email.toLowerCase();
            if ((lowerEmail.equals("udanten2@gmail.com") || lowerEmail.equals("udenten2@gmail.com"))
                    && !"ADMIN".equals(user.getRole())) {
                user.setRole("ADMIN");
                modified = true;
            } else if (lowerEmail.equals("sathiraudan21@gmail.com") && !"STUDENT".equals(user.getRole())) {
                user.setRole("STUDENT");
                modified = true;
            }
        }

        if (modified) {
            user = userRepository.save(user);
        }

        System.out.println(">> [OAuth] Logged in: " + email + " | Role: " + user.getRole());

        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole()));
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092

        return new CustomOAuth2User(user.getId(), oauth2User, authorities);
    }
}
