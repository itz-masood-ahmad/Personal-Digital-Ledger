package com.ledger.digital.personal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

public class CreditDto {

    @Schema(description = "Unique ID of the credit entry", example = "1")
    private Long id;

    @Schema(description = "Source of the credit (e.g., salary, gift)", example = "Salary")
    private String source;

    @Schema(description = "Amount credited", example = "1500.50")
    private BigDecimal amount;

    @Schema(description = "Optional note or description for the credit", example = "November salary")
    private String note;

    @Schema(description = "Flag indicating if this credit should be used to repay debt", example = "false")
    private boolean repayDebt;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public boolean isRepayDebt() {
        return repayDebt;
    }

    public void setRepayDebt(boolean repayDebt) {
        this.repayDebt = repayDebt;
    }
}
