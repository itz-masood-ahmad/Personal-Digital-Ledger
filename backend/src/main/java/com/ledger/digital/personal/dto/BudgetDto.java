package com.ledger.digital.personal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

public class BudgetDto {

    @Schema(description = "Unique ID of the budget", example = "1")
    private Long id;

    @Schema(description = "Name of the budget", example = "Monthly Groceries")
    private String name;

    @Schema(description = "Total allocated amount for this budget", example = "5000.00")
    private BigDecimal amount;

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

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
