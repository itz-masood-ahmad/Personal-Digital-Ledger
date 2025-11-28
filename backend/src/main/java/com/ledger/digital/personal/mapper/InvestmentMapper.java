package com.ledger.digital.personal.mapper;

import com.ledger.digital.personal.dto.InvestmentDto;
import com.ledger.digital.personal.model.Investment;

public class InvestmentMapper {

    public static InvestmentDto toDto(Investment i) {
        if (i == null) return null;
        InvestmentDto dto = new InvestmentDto();
        dto.setId(i.getId());
        dto.setName(i.getName());
        dto.setValue(i.getValue());
        dto.setType(i.getType());
        dto.setAccountId(i.getAccount() != null ? i.getAccount().getId() : null);
        dto.setBudgetId(i.getBudget() != null ? i.getBudget().getId() : null);
        return dto;
    }

    public static Investment toEntity(InvestmentDto dto) {
        if (dto == null) return null;
        Investment i = new Investment();
        i.setId(dto.getId());
        i.setName(dto.getName());
        i.setValue(dto.getValue());
        i.setType(dto.getType());
        // account and budget will be set in service
        return i;
    }
}
