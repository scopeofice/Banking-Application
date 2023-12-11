package com.bank.itc.controller;

import com.bank.itc.dto.*;
import com.bank.itc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Role;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping
    public BankResponse createAccount(@RequestBody UserRequestDTO userRequest){
        return userService.createAccount(userRequest);
    }
    @GetMapping("/balanceEnquiry/{request}")
    public String balanceEnquiry(@PathVariable String request){
        return userService.balanceEnquiry(request);
    }

    @GetMapping("/nameEnquiry")
    public String nameEnquiry(@RequestBody EnquiryRequest request){
        return userService.nameEnquiry(request);
    }

    @PostMapping("/credit")
    public BankResponse creditAccount(@RequestBody CreditDebitRequest request){
        return userService.creditAccount(request);
    }

    @PostMapping("/debit")
    public BankResponse debitAccount(@RequestBody CreditDebitRequest request){
        return userService.debitAccount(request);
    }

    @PostMapping("/transfer")
    public BankResponse transferMoney(@RequestBody TransferRequest request){
        return userService.transfer(request);
    }

    @PostMapping("/login")
    public BankResponse userLogin(@RequestBody LoginDTO request){
        return userService.login(request);
    }
}
