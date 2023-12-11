package com.bank.itc.repository;

import com.bank.itc.entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository <Transactions, String> {

}
