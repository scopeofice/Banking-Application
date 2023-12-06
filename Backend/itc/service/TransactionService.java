package com.bank.itc.service;

import com.bank.itc.dto.TransactionDTO;
import com.bank.itc.entity.Transactions;

public interface TransactionService {
    void saveTransaction(TransactionDTO transactions);
}
