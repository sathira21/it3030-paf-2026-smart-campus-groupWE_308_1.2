package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Add this method - findByEmail
    Optional<User> findByEmail(String email);

    List<User> findAllByRole(String role);

    // Add this method - existsByEmail
    Boolean existsByEmail(String email);
}