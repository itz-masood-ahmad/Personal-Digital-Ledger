package com.ledger.digital.personal.repo;

import com.ledger.digital.personal.model.Credit;
import com.ledger.digital.personal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CreditRepository extends JpaRepository<Credit, Long> {
    List<Credit> findByAccountUser(User user);
}