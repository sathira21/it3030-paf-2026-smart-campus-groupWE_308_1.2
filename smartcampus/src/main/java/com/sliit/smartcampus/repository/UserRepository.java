package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
<<<<<<< HEAD
import java.util.Optional;
=======
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
<<<<<<< HEAD
    Optional<User> findByEmail(String email);
}
=======

    // Add this method - findByEmail
    Optional<User> findByEmail(String email);

    List<User> findAllByRole(String role);

    // Add this method - existsByEmail
    Boolean existsByEmail(String email);
}
>>>>>>> 91c028da84f00334ed183a773fef20bb2d67e092
