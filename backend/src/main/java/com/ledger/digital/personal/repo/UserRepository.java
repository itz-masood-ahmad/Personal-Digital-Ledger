package com.ledger.digital.personal.repo;

import com.ledger.digital.personal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    //    Find user by email for login and registration
    Optional<User> findByEmail(String email);

    // 🔑 New: Find user using API key for filter authentication
    Optional<User> findByApiKey(String apiKey);

    //  🔐 New: Find user by reset token for password reset functionality
    Optional<User> findByResetToken(String resetToken);

}
