package com.ledger.digital.personal.service;

import com.ledger.digital.personal.dto.InvestmentDto;
import com.ledger.digital.personal.mapper.InvestmentMapper;
import com.ledger.digital.personal.model.Account;
import com.ledger.digital.personal.model.Budget;
import com.ledger.digital.personal.model.Investment;
import com.ledger.digital.personal.model.User;
import com.ledger.digital.personal.repo.AccountRepository;
import com.ledger.digital.personal.repo.BudgetRepository;
import com.ledger.digital.personal.repo.InvestmentRepository;
import com.ledger.digital.personal.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvestmentService {

    private final InvestmentRepository investmentRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final BudgetRepository budgetRepository;

    public InvestmentService(InvestmentRepository investmentRepository,
                             UserRepository userRepository,
                             AccountRepository accountRepository,
                             BudgetRepository budgetRepository) {
        this.investmentRepository = investmentRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.budgetRepository = budgetRepository;
    }

    // Create a new investment
    public InvestmentDto createInvestment(InvestmentDto dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Investment investment = InvestmentMapper.toEntity(dto);
        investment.setUser(user);

        // Deduct from account if linked
        if (dto.getAccountId() != null) {
            Account account = accountRepository.findById(dto.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            if (!account.getUser().getId().equals(user.getId()))
                throw new RuntimeException("Account does not belong to user");

            investment.setAccount(account);
            account.setBalance(account.getBalance().subtract(dto.getValue()));
            accountRepository.save(account);
        }

        // Deduct from budget if linked
        if (dto.getBudgetId() != null) {
            Budget budget = budgetRepository.findById(dto.getBudgetId())
                    .orElseThrow(() -> new RuntimeException("Budget not found"));

            if (!budget.getUser().getId().equals(user.getId()))
                throw new RuntimeException("Budget does not belong to user");

            investment.setBudget(budget);
            budget.setAmount(budget.getAmount().subtract(dto.getValue()));
            budgetRepository.save(budget);
        }

        return InvestmentMapper.toDto(investmentRepository.save(investment));
    }

    // List all investments of a user
    public List<InvestmentDto> listInvestments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return investmentRepository.findByUser(user)
                .stream()
                .map(InvestmentMapper::toDto)
                .collect(Collectors.toList());
    }

    // Update investment by adding or removing amount
    public InvestmentDto updateInvestment(Long id, BigDecimal changeAmount,
                                          boolean addToAccount, Long accountId,
                                          Long budgetId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Investment investment = investmentRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Investment not found"));

        // Add to investment
        investment.setValue(investment.getValue().add(changeAmount));

        // Deduct from account if specified
        if (accountId != null) {
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            account.setBalance(account.getBalance().subtract(changeAmount));
            accountRepository.save(account);

            // link account to investment if not already
            investment.setAccount(account);
        }

        // Deduct from budget if specified
        if (budgetId != null) {
            Budget budget = budgetRepository.findById(budgetId)
                    .orElseThrow(() -> new RuntimeException("Budget not found"));

            budget.setAmount(budget.getAmount().subtract(changeAmount));
            budgetRepository.save(budget);

            // link budget to investment if not already
            investment.setBudget(budget);
        }

        return InvestmentMapper.toDto(investmentRepository.save(investment));
    }

    // Close investment
    public InvestmentDto closeInvestment(Long id, boolean addToAccount, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Investment investment = investmentRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Investment not found"));

        // Add back to account if requested
        if (addToAccount && investment.getAccount() != null) {
            Account account = investment.getAccount();
            account.setBalance(account.getBalance().add(investment.getValue()));
            accountRepository.save(account);
        }

        investmentRepository.delete(investment);
        return InvestmentMapper.toDto(investment);
    }
}
