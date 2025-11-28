package com.ledger.digital.personal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

public class AccountDto {

    @Schema(description = "Unique ID of the account", example = "1")
    private Long id;

    @Schema(description = "Name of the account", example = "Savings Account")
    private String accountName;

    @Schema(description = "Type of the account", example = "SAVINGS")
    private String type;

    @Schema(description = "Current balance of the account", example = "15000.50")
    private BigDecimal balance;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
