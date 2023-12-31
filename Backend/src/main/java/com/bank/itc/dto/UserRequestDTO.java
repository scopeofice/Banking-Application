package com.bank.itc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDTO {
    private String firstName;
    private String lastName;
    private String address;
    private String email;
    private String phoneNumber;
    private String password;
    private String accountType;
}
