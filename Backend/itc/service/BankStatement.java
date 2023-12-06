package com.bank.itc.service;

import com.bank.itc.entity.Transactions;
import com.bank.itc.repository.TransactionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@AllArgsConstructor
public class BankStatement {
    private TransactionRepository transactionRepository;
    public List<Transactions> generateStatement(String accountNumber, String startDate, String endDate){
        LocalDate start = LocalDate.parse(startDate, DateTimeFormatter.ISO_DATE);
        LocalDate end = LocalDate.parse(endDate, DateTimeFormatter.ISO_DATE);
        List<Transactions> transactionsList = transactionRepository.findAll().stream().filter(transactions -> transactions.getAccountNumber().equals(accountNumber)).filter(transactions -> transactions.getCreatedAt().isAfter(start)).filter(transactions -> transactions.getModifiedAt().isBefore(end)).toList();

        return transactionsList;
    }
    public List<Transactions> getAllTransactions(String accountNumber){
        List<Transactions> transactionsList = transactionRepository.findAll().stream().filter(transactions -> transactions.getAccountNumber().equals(accountNumber)).toList();

        return transactionsList;
    }
}
