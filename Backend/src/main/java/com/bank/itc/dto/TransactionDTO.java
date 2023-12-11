package com.bank.itc.dto;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDTO {
    private String transactionType;
    private BigDecimal amount;
    private String accountNumber;
    private String status;
    private String receiver;
}
