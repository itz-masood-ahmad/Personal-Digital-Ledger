package com.ledger.digital.personal.mapper;

import com.ledger.digital.personal.dto.CreditDto;
import com.ledger.digital.personal.model.Credit;

public class CreditMapper {
    public static CreditDto toDto(Credit c) {
        if (c == null) return null;
        CreditDto d = new CreditDto();
        d.setId(c.getId());
        d.setSource(c.getSource());
        d.setAmount(c.getAmount());
        d.setNote(c.getNote());
        return d;
    }

    public static Credit toEntity(CreditDto d) {
        if (d == null) return null;
        Credit c = new Credit();
        c.setId(d.getId());
        c.setSource(d.getSource());
        c.setAmount(d.getAmount());
        c.setNote(d.getNote());
        return c;
    }
}