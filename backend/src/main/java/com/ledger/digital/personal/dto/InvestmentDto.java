package com.ledger.digital.personal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

public class InvestmentDto {

    @Schema(description = "Unique ID of the investment", example = "1")
    private Long id;

    @Schema(description = "Name of the investment", example = "Mutual Fund - ABC")
    private String name;

    @Schema(description = "Type of investment", example = "STOCK")
    private String type;

    @Schema(description = "Current value of the investment", example = "10000.50")
    private BigDecimal value;

    @Schema(description = "ID of the account associated with this investment (nullable if not linked)", example = "2")
    private Long accountId;

    @Schema(description = "ID of the budget associated with this investment (nullable if not linked)", example = "3")
    private Long budgetId;

    @Schema(description = "Flag indicating whether to add money back to the account on closing the investment", example = "true")
    private boolean addToAccountOnClose;

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Long getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(Long budgetId) {
        this.budgetId = budgetId;
    }

    public String getType() { return type; }

    public void setType(String type) { this.type = type; }

    public boolean isAddToAccountOnClose() {
        return addToAccountOnClose;
    }

    public void setAddToAccountOnClose(boolean addToAccountOnClose) { this.addToAccountOnClose = addToAccountOnClose; }
}
