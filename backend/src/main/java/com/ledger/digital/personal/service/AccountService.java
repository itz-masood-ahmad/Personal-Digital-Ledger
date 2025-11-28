package com.ledger.digital.personal.service;

import com.ledger.digital.personal.dto.AccountDto;
import com.ledger.digital.personal.mapper.AccountMapper;
import com.ledger.digital.personal.model.Account;
import com.ledger.digital.personal.model.User;
import com.ledger.digital.personal.repo.AccountRepository;
import com.ledger.digital.personal.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    // Create account
    public AccountDto createAccount(AccountDto dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = new Account();
        account.setAccountName(dto.getAccountName());
        account.setType(dto.getType());
        account.setBalance(dto.getBalance() != null ? dto.getBalance() : account.getBalance());
        account.setUser(user);

        accountRepository.save(account);
        return AccountMapper.toDto(account);
    }

    // Get all accounts
    public List<AccountDto> getAllAccounts(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUser(user)
                .stream()
                .map(AccountMapper::toDto)
                .collect(Collectors.toList());
    }

    // Get account by id
    public AccountDto getAccount(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findById(id)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return AccountMapper.toDto(account);
    }

    // Update account
    public AccountDto updateAccount(Long id, AccountDto dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findById(id)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setAccountName(dto.getAccountName());
        account.setType(dto.getType());
        account.setBalance(dto.getBalance());
        accountRepository.save(account);
        return AccountMapper.toDto(account);
    }

    // Delete account
    public void deleteAccount(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findById(id)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Account not found"));

        accountRepository.delete(account);
    }
}
