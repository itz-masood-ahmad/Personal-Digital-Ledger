package com.ledger.digital.personal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Investment name is required")
    private String name;

    @NotNull(message = "Investment value is required")
    private BigDecimal value;

    @NotNull(message = "Investment type is required")
    private String type;

    @ManyToOne
    private User user;

    @ManyToOne
    private Account account;  // optional, if investment linked to account

    @ManyToOne
    private Budget budget;    // optional, if investment linked to budget

    // Getters & setters
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Budget getBudget() {
        return budget;
    }

    public void setBudget(Budget budget) {
        this.budget = budget;
    }

    public String getType() { return type; }

    public void setType(String type) { this.type = type; }
}
