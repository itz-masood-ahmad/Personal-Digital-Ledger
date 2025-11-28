package com.ledger.digital.personal.mapper;

import com.ledger.digital.personal.dto.AccountDto;
import com.ledger.digital.personal.model.Account;

public class AccountMapper {

    public static AccountDto toDto(Account account) {
        if (account == null) return null;
        AccountDto dto = new AccountDto();
        dto.setId(account.getId());
        dto.setAccountName(account.getAccountName());
        dto.setType(account.getType());
        dto.setBalance(account.getBalance());
        return dto;
    }

    public static Account toEntity(AccountDto dto) {
        if (dto == null) return null;
        Account account = new Account();
        account.setId(dto.getId());
        account.setAccountName(dto.getAccountName());
        account.setType(dto.getType());
        account.setBalance(dto.getBalance());
        return account;
    }
}
