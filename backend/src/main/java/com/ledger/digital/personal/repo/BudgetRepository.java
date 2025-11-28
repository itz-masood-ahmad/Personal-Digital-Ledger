package com.ledger.digital.personal.repo;

import com.ledger.digital.personal.model.Budget;
import com.ledger.digital.personal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user);
}
