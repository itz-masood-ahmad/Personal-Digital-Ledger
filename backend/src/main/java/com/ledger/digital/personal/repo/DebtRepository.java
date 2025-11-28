package com.ledger.digital.personal.repo;

import com.ledger.digital.personal.model.Debt;
import com.ledger.digital.personal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DebtRepository extends JpaRepository<Debt, Long> {
    Optional<Debt> findByPersonAndUser(String person, User user);

    List<Debt> findByUser(User user);
}