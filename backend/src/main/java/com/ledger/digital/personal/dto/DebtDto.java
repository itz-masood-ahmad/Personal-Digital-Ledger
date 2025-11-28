package com.ledger.digital.personal.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

public class DebtDto {

    @Schema(description = "Unique ID of the debt entry", example = "1")
    private Long id;

    @Schema(description = "Person to whom the debt is owed or from whom it is borrowed", example = "John Doe")
    private String person;

    @Schema(description = "Amount of the debt", example = "2500.00")
    private BigDecimal amount;

    @Schema(description = "Flag indicating if the debt has been given (true) or taken (false)", example = "true")
    private Boolean given;

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPerson() {
        return person;
    }

    public void setPerson(String person) {
        this.person = person;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Boolean getGiven() {
        return given;
    }

    public void setGiven(Boolean given) {
        this.given = given;
    }
}
