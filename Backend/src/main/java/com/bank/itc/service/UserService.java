package com.bank.itc.service;

import com.bank.itc.dto.*;


public interface UserService {
    BankResponse createAccount(UserRequestDTO userRequest);
    String balanceEnquiry(String request);
    String nameEnquiry(EnquiryRequest request);
    BankResponse creditAccount(CreditDebitRequest request);
    BankResponse debitAccount(CreditDebitRequest request);
    BankResponse transfer(TransferRequest request);
    BankResponse login(LoginDTO request);

}
