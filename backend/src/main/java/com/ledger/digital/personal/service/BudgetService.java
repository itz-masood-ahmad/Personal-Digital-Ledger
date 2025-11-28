package com.ledger.digital.personal.service;

import com.ledger.digital.personal.dto.BudgetDto;
import com.ledger.digital.personal.mapper.BudgetMapper;
import com.ledger.digital.personal.model.Account;
import com.ledger.digital.personal.model.Budget;
import com.ledger.digital.personal.model.User;
import com.ledger.digital.personal.repo.AccountRepository;
import com.ledger.digital.personal.repo.BudgetRepository;
import com.ledger.digital.personal.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public BudgetService(BudgetRepository budgetRepository, UserRepository userRepository,
                         AccountRepository accountRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    public BudgetDto createBudget(BudgetDto dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = BudgetMapper.toEntity(dto);
        budget.setUser(user);
        budgetRepository.save(budget);

        return BudgetMapper.toDto(budget);
    }

    public BudgetDto updateBudget(Long id, BudgetDto dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        budget.setName(dto.getName());
        budget.setAmount(dto.getAmount());
        budgetRepository.save(budget);

        return BudgetMapper.toDto(budget);
    }

    public void closeBudget(Long id, String userEmail, boolean addRemainingToAccount, Long accountId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = budgetRepository.findById(id)
                .filter(b -> b.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (addRemainingToAccount && accountId != null) {
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            if (!account.getUser().getId().equals(user.getId()))
                throw new RuntimeException("Account does not belong to user");

            account.setBalance(account.getBalance().add(budget.getAmount()));
            accountRepository.save(account);
        }

        budgetRepository.delete(budget);
    }

    public List<BudgetDto> getBudgets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return budgetRepository.findByUser(user).stream()
                .map(BudgetMapper::toDto)
                .collect(Collectors.toList());
    }
}
