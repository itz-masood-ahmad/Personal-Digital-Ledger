package com.ledger.digital.personal.service;

import com.ledger.digital.personal.dto.CreditDto;
import com.ledger.digital.personal.mapper.CreditMapper;
import com.ledger.digital.personal.model.Account;
import com.ledger.digital.personal.model.Credit;
import com.ledger.digital.personal.model.Debt;
import com.ledger.digital.personal.model.User;
import com.ledger.digital.personal.repo.AccountRepository;
import com.ledger.digital.personal.repo.CreditRepository;
import com.ledger.digital.personal.repo.DebtRepository;
import com.ledger.digital.personal.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CreditService {

    private final CreditRepository creditRepository;
    private final AccountRepository accountRepository;
    private final DebtRepository debtRepository;
    private final UserRepository userRepository;

    public CreditService(CreditRepository creditRepository,
                         AccountRepository accountRepository,
                         DebtRepository debtRepository,
                         UserRepository userRepository) {
        this.creditRepository = creditRepository;
        this.accountRepository = accountRepository;
        this.debtRepository = debtRepository;
        this.userRepository = userRepository;
    }

    public CreditDto addCredit(Long accountId, CreditDto dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findById(accountId)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Credit credit = new Credit();
        credit.setAccount(account);
        credit.setSource(dto.getSource());
        credit.setAmount(dto.getAmount());
        credit.setNote(dto.getNote());

        // 1️⃣ Check if a debt exists from/to this person
        Debt debt = debtRepository.findByPersonAndUser(dto.getSource(), user).orElse(null);

        if (debt != null && dto.isRepayDebt()) {
            if (debt.getGiven()) {
                // If user had given debt to this person, receiving money reduces debt
                BigDecimal newDebt = debt.getAmount().subtract(dto.getAmount());
                debt.setAmount(newDebt.max(BigDecimal.ZERO));
                if (newDebt.compareTo(BigDecimal.ZERO) <= 0) {
                    debtRepository.delete(debt);
                } else {
                    debtRepository.save(debt);
                }
            } else {
                // If user had taken debt from this person, paying back reduces debt
                BigDecimal newDebt = debt.getAmount().subtract(dto.getAmount());
                debt.setAmount(newDebt.max(BigDecimal.ZERO));
                if (newDebt.compareTo(BigDecimal.ZERO) <= 0) {
                    debtRepository.delete(debt);
                } else {
                    debtRepository.save(debt);
                }
            }
        }

        // 2️⃣ Update account balance
        account.setBalance(account.getBalance().add(dto.getAmount()));
        accountRepository.save(account);

        return CreditMapper.toDto(creditRepository.save(credit));
    }

    // List all credits of a user
    public List<CreditDto> list(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return creditRepository.findByAccountUser(user).stream()
                .map(CreditMapper::toDto)
                .collect(Collectors.toList());
    }

    public CreditDto get(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Credit credit = creditRepository.findById(id)
                .filter(c -> c.getAccount().getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Credit not found"));

        return CreditMapper.toDto(credit);
    }

    public void delete(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Credit credit = creditRepository.findById(id)
                .filter(c -> c.getAccount().getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Credit not found"));

        // Optionally: revert account balance and/or debt if needed

        creditRepository.delete(credit);
    }
}
