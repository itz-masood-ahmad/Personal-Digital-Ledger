package com.ledger.digital.personal.repo;

import com.ledger.digital.personal.model.ForgotPasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForgotPasswordTokenRepository extends JpaRepository<ForgotPasswordToken, Long> {

    Optional<ForgotPasswordToken> findByToken(String token);

    void deleteByToken(String token);
}
