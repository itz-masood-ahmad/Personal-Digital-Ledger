package com.ledger.digital.personal.repo;

import com.ledger.digital.personal.model.Account;
import com.ledger.digital.personal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {


    List<Account> findByUser(User user);
}