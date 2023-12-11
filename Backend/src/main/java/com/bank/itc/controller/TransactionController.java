package com.bank.itc.controller;

import com.bank.itc.entity.Transactions;
import com.bank.itc.service.BankStatement;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bankStatement")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {
    private BankStatement bankStatement;
    @GetMapping
    public List<Transactions> generateBankStatement(@RequestParam String accountNumber, @RequestParam String startDate,@RequestParam String endDate){
        return bankStatement.generateStatement(accountNumber,startDate,endDate);
    }
    @GetMapping("/transactions/{accountNumber}")
    public List<Transactions> getTransactions(@PathVariable String accountNumber){
        return bankStatement.getAllTransactions(accountNumber);
    }
}
