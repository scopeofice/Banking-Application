package com.bank.itc.service;

import com.bank.itc.dto.TransactionDTO;
import com.bank.itc.entity.Transactions;
import com.bank.itc.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionServiceImpl implements TransactionService{
    @Autowired
    TransactionRepository transactionRepository;
    @Override
    public void saveTransaction(TransactionDTO request) {
        Transactions transactions = Transactions.builder()
                .transactionType(request.getTransactionType())
                .receiver(request.getReceiver())
                .accountNumber(request.getAccountNumber())
                .amount(request.getAmount())
                .status("SUCCESS")
                .build();
        transactionRepository.save(transactions);
    }
}
