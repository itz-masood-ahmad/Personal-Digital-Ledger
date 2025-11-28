package com.ledger.digital.personal.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "debts")
public class Debt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String person; // Name of the person

    private BigDecimal amount;

    private Boolean given; // true if user gave money to this person, false if user owes

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // link to owner user

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
    }  // must match mapper

    public void setGiven(Boolean given) {
        this.given = given;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
