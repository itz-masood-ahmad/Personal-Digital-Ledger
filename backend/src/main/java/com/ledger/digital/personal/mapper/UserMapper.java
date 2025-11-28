package com.ledger.digital.personal.mapper;

import com.ledger.digital.personal.dto.UserDto;
import com.ledger.digital.personal.model.User;

public class UserMapper {
    public static UserDto toDto(User u) {
        if (u == null)
            return null;
        UserDto d = new UserDto();
        d.setId(u.getId());
        d.setFirstName(u.getFirstName());
        d.setLastName(u.getLastName());
        d.setEmail(u.getEmail());
        return d;
    }

    public static User toEntity(UserDto d) {
        if (d == null)
            return null;
        User u = new User();
        u.setId(d.getId());
        u.setFirstName(d.getFirstName());
        u.setLastName(d.getLastName());
        u.setEmail(d.getEmail());
        return u;
    }
}