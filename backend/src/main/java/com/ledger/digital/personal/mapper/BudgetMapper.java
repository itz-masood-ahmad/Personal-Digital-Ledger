package com.ledger.digital.personal.mapper;

import com.ledger.digital.personal.dto.BudgetDto;
import com.ledger.digital.personal.model.Budget;

public class BudgetMapper {
    public static BudgetDto toDto(Budget b) {
        if (b == null) return null;
        BudgetDto d = new BudgetDto();
        d.setId(b.getId());
        d.setName(b.getName());
        d.setAmount(b.getAmount());
        return d;
    }

    public static Budget toEntity(BudgetDto d) {
        if (d == null) return null;
        Budget b = new Budget();
        b.setId(d.getId());
        b.setName(d.getName());
        b.setAmount(d.getAmount());
        return b;
    }
}
