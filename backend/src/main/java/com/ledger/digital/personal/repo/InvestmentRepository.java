package com.ledger.digital.personal.repo;

import com.ledger.digital.personal.model.Investment;
import com.ledger.digital.personal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    // Fetch all investments for a specific user
    List<Investment> findByUser(User user);
}
