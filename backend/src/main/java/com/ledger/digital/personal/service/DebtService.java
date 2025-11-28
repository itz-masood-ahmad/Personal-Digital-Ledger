package com.ledger.digital.personal.service;

import com.ledger.digital.personal.dto.DebtDto;
import com.ledger.digital.personal.mapper.DebtMapper;
import com.ledger.digital.personal.model.Account;
import com.ledger.digital.personal.model.Debt;
import com.ledger.digital.personal.model.User;
import com.ledger.digital.personal.repo.AccountRepository;
import com.ledger.digital.personal.repo.DebtRepository;
import com.ledger.digital.personal.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DebtService {

    private final DebtRepository debtRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public DebtService(DebtRepository debtRepository, UserRepository userRepository, AccountRepository accountRepository) {
        this.debtRepository = debtRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public DebtDto addDebt(DebtDto dto, String userEmail, Long accountId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Debt debt = DebtMapper.toEntity(dto);
        debt.setUser(user);

        // Update Account on Create
        if (accountId != null) {
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            if (debt.getGiven()) {
                // I Lent money -> Money leaves my account
                account.setBalance(account.getBalance().subtract(debt.getAmount()));
            } else {
                // I Borrowed money -> Money enters my account
                account.setBalance(account.getBalance().add(debt.getAmount()));
            }
            accountRepository.save(account);
        }

        debtRepository.save(debt);
        return DebtMapper.toDto(debt);
    }

    @Transactional
    public DebtDto updateDebt(Long id, DebtDto dto, String userEmail, Long accountId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Debt debt = debtRepository.findById(id)
                .filter(d -> d.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Debt not found"));

        // 1. Calculate the difference (New - Old)
        BigDecimal oldAmount = debt.getAmount();
        BigDecimal newAmount = dto.getAmount();
        BigDecimal diff = newAmount.subtract(oldAmount);

        // 2. Update Debt Record
        debt.setPerson(dto.getPerson());
        debt.setAmount(newAmount);
        debt.setGiven(dto.getGiven());
        debtRepository.save(debt);

        // 3. Update Account Balance based on the difference
        if (accountId != null && diff.compareTo(BigDecimal.ZERO) != 0) {
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            if (!account.getUser().getId().equals(user.getId()))
                throw new RuntimeException("Account does not belong to user");

            if (debt.getGiven()) {
                // I Lent (Asset).
                // If diff is positive (Lent More) -> Money leaves account.
                // If diff is negative (Partial Repay) -> Money returns to account.
                account.setBalance(account.getBalance().subtract(diff));
            } else {
                // I Owe (Liability).
                // If diff is positive (Borrowed More) -> Money enters account.
                // If diff is negative (Partial Repay) -> Money leaves account.
                account.setBalance(account.getBalance().add(diff));
            }
            accountRepository.save(account);
        }

        return DebtMapper.toDto(debt);
    }

    @Transactional
    public void closeDebt(Long id, String userEmail, Long accountId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Debt debt = debtRepository.findById(id)
                .filter(d -> d.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Debt not found"));

        // If closing with an account link, settle the remaining balance
        if (accountId != null && debt.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            if (debt.getGiven()) {
                // Collection: Money comes back to account
                account.setBalance(account.getBalance().add(debt.getAmount()));
            } else {
                // Repayment: Money leaves account
                account.setBalance(account.getBalance().subtract(debt.getAmount()));
            }
            accountRepository.save(account);
        }

        debtRepository.delete(debt);
    }

    public List<DebtDto> getDebts(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        return debtRepository.findByUser(user).stream().map(DebtMapper::toDto).collect(Collectors.toList());
    }
}