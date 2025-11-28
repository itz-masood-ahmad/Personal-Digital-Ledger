package com.ledger.digital.personal.mapper;

import com.ledger.digital.personal.dto.DebtDto;
import com.ledger.digital.personal.model.Debt;

public class DebtMapper {

    public static DebtDto toDto(Debt d) {
        if (d == null) return null;
        DebtDto dto = new DebtDto();
        dto.setId(d.getId());
        dto.setPerson(d.getPerson());
        dto.setAmount(d.getAmount());
        dto.setGiven(d.getGiven());
        return dto;
    }

    public static Debt toEntity(DebtDto dto) {
        if (dto == null) return null;
        Debt d = new Debt();
        d.setId(dto.getId());
        d.setPerson(dto.getPerson());
        d.setAmount(dto.getAmount());
        d.setGiven(dto.getGiven());
        return d;
    }
}
