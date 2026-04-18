package com.sliit.smartcampus.config;

import com.sliit.smartcampus.model.User;
import com.sliit.smartcampus.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class UserDataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.findByEmail("admin@smartcampus.com").ifPresentOrElse(admin -> {
                admin.setPassword(passwordEncoder.encode("password123"));
                admin.setRole("ADMIN");
                admin.setEnabled(true);
                userRepository.save(admin);
                System.out.println(">> Smart Campus Admin Password Re-Hashed and Account Enabled.");
            }, () -> {
                User admin = new User();
                admin.setName("System Administrator");
                admin.setEmail("admin@smartcampus.com");
                admin.setPassword(passwordEncoder.encode("password123"));
                admin.setRole("ADMIN");
                admin.setEnabled(true);
                userRepository.save(admin);
                System.out.println(">> Smart Campus Admin User Initialized.");
            });
            userRepository.findByEmail("student@smartcampus.com").ifPresentOrElse(student -> {
                student.setPassword(passwordEncoder.encode("password123"));
                student.setRole("USER");
                student.setEnabled(true);
                userRepository.save(student);
                System.out.println(">>>> Smart Campus Student Password Re-Hashed and Account Enabled.");
            }, () -> {
                User student = new User();
                student.setName("Test Student");
                student.setEmail("student@smartcampus.com");
                student.setPassword(passwordEncoder.encode("password123"));
                student.setRole("USER");
                student.setEnabled(true);
                userRepository.save(student);
                System.out.println(">>>> Smart Campus Student User Initialized.");
            });

            // Specific Admin Account for Testing MFA
            userRepository.findByEmail("udanten2@gmail.com").ifPresentOrElse(admin -> {
                admin.setPassword(passwordEncoder.encode("password123"));
                admin.setRole("ADMIN");
                admin.setEnabled(true);
                userRepository.save(admin);
                System.out.println(">>>> MFA Test Admin (udanten2@gmail.com) Password Reset.");
            }, () -> {
                User admin = new User();
                admin.setName("Sathira Admin");
                admin.setEmail("udanten2@gmail.com");
                admin.setPassword(passwordEncoder.encode("password123")); // Default password
                admin.setRole("ADMIN");
                admin.setEnabled(true);
                userRepository.save(admin);
                System.out.println(">>>> MFA Test Admin (udanten2@gmail.com) Initialized.");
            });
        };
    }
}
