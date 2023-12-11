package com.bank.itc.service;

import com.bank.itc.config.JwtTokenProvider;
import com.bank.itc.dto.*;
import com.bank.itc.entity.Role;
import com.bank.itc.entity.User;
import com.bank.itc.repository.UserRepository;
import com.bank.itc.util.AccountUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService{
    @Autowired
    UserRepository userRepo;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    TransactionService transactionService;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtTokenProvider jwtTokenProvider;
    @Autowired
    EmailService emailService;
    @Override
    public BankResponse createAccount(UserRequestDTO userRequest) {
        if(userRepo.existsByEmail((userRequest.getEmail()))){
            return BankResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_ALREADY_EXISTS_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_ALREADY_EXISTS_MESSAGE)
                    .accountInfo(null)
                    .build();
        }
        else{

        User newUser = User.builder()
                .firstName(userRequest.getFirstName())
                .lastName((userRequest.getLastName()))
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .address(userRequest.getAddress())
                .accountType(userRequest.getAccountType())
                .accountNumber(AccountUtils.genrateAccountNumber())
                .accountBalance(BigDecimal.ZERO)
                .phoneNumber(userRequest.getPhoneNumber())
                .role(Role.ROLE_USER)
                .status("ACTIVE")
                .build();
        User savedUser = userRepo.save(newUser);

        EmailDTO emailDetails = EmailDTO.builder()
                .recipient(savedUser.getEmail())
                .subject("Account Creation")
                .messageBody("Congratulations, Your account has been successfully created")
                .build();
        emailService.sendEmailAlert(emailDetails);

        return BankResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_CREATION_SUCCESS)
                .responseMessage(AccountUtils.ACCOUNT_CREATION_MESSAGE)
                .accountInfo(AccountInfo.builder()
                        .accountBalance(savedUser.getAccountBalance())
                        .accountNumber(savedUser.getAccountNumber())
                        .accountName(savedUser.getFirstName()+" "+savedUser.getLastName())
                        .build())
                .build();
        }
    }

    @Override
    public BankResponse login(LoginDTO loginDTO){
        Authentication authentication = null;
        authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword()));

//        EmailDTO loginAlert = EmailDTO.builder()
//                .subject("You're logged in!")
//                .recipient(loginDTO.getEmail())
//                .messageBody("You logged into your account")
//                .build();
//
//        emailService.sendEmailAlert((loginAlert));

        Optional<User> foundUser = userRepo.findByEmail(loginDTO.getEmail());

        return BankResponse.builder()
                .responseCode("Login Success")
                .responseMessage(jwtTokenProvider.generateToken(authentication))
                .accountInfo(AccountInfo.builder()
                        .accountBalance(foundUser.get().getAccountBalance())
                        .accountNumber(foundUser.get().getAccountNumber())
                        .accountName(foundUser.get().getFirstName()+" "+foundUser.get().getLastName())
                        .address(foundUser.get().getAddress())
                        .phoneNumber(foundUser.get().getPhoneNumber())
                        .email(foundUser.get().getEmail())
                        .accountType(foundUser.get().getAccountType())
                        .build())
                .build();

    }

//    @Override
//    public BankResponse balanceEnquiry(EnquiryRequest request) {
//        if(!userRepo.existsByAccountNumber(request.getAccountNumber())){
//           return BankResponse.builder()
//                   .responseCode(AccountUtils.ACCOUNT_NOT_EXISTS)
//                   .responseMessage(AccountUtils.ACCOUNT_NOT_EXISTS_MESSAGE)
//                   .accountInfo(null)
//                   .build();
//        }
//        else{
//            User foundUser = userRepo.findByAccountNumber(request.getAccountNumber());
//            return BankResponse.builder()
//                    .responseCode(AccountUtils.ACCOUNT_FOUND)
//                    .responseMessage(AccountUtils.ACCOUNT_FOUND_MESSAGE)
//                    .accountInfo(AccountInfo.builder()
//                            .accountBalance(foundUser.getAccountBalance())
//                            .accountNumber(request.getAccountNumber())
//                            .accountName(foundUser.getFirstName()+" "+foundUser.getLastName())
//                            .build())
//                    .build();
//        }
//    }

    @Override
    public String balanceEnquiry(String request) {
        if(!userRepo.existsByAccountNumber(request)){
            return "User does not exists";
        }else{
            return userRepo.findByAccountNumber(request).getAccountBalance().toString();
        }
    }

    @Override
    public String nameEnquiry(EnquiryRequest request) {
        if(!userRepo.existsByAccountNumber(request.getAccountNumber())){
            return AccountUtils.ACCOUNT_NOT_EXISTS_MESSAGE;
        }else{
            User foundUser = userRepo.findByAccountNumber(request.getAccountNumber());
            return foundUser.getFirstName() +" "+ foundUser.getLastName();
        }
    }

    @Override
    public BankResponse creditAccount(CreditDebitRequest request) {
        if(!userRepo.existsByAccountNumber(request.getAccountNumber())){
            return BankResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_NOT_EXISTS)
                    .responseMessage(AccountUtils.ACCOUNT_NOT_EXISTS_MESSAGE)
                    .accountInfo(null)
                    .build();
        }
        else{
            User userToCredit = userRepo.findByAccountNumber(request.getAccountNumber());
            userToCredit.setAccountBalance(userToCredit.getAccountBalance().add(request.getAmount()));
            userRepo.save(userToCredit);

            TransactionDTO transactionDTO = TransactionDTO.builder()
                    .accountNumber(userToCredit.getAccountNumber())
                    .receiver(userToCredit.getFirstName()+" "+userToCredit.getLastName())
                    .transactionType("CREDIT")
                    .amount(request.getAmount())
                    .status("SUCCESS")
                    .build();
            transactionService.saveTransaction(transactionDTO);

            return BankResponse.builder()
                    .responseCode(AccountUtils.AMOUNT_CREDITED_SUCCESS_CODE)
                    .responseMessage(AccountUtils.AMOUNT_CREDITED_SUCCESS_MESSAGE)
                    .accountInfo(AccountInfo.builder()
                            .accountName(userToCredit.getFirstName()+" "+userToCredit.getLastName())
                            .accountNumber(userToCredit.getAccountNumber())
                            .accountBalance(userToCredit.getAccountBalance())
                            .build())
                    .build();
        }
    }

    @Override
    public BankResponse debitAccount(CreditDebitRequest request) {
        if(!userRepo.existsByAccountNumber(request.getAccountNumber())){
            return BankResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_NOT_EXISTS)
                    .responseMessage(AccountUtils.ACCOUNT_NOT_EXISTS_MESSAGE)
                    .accountInfo(null)
                    .build();
        }
        else{
            User userToDebit = userRepo.findByAccountNumber(request.getAccountNumber());
            int comparisonResult = userToDebit.getAccountBalance().compareTo(request.getAmount());

            if (comparisonResult < 0){
                return BankResponse.builder()
                        .responseCode(AccountUtils.INSUFFICIENT_BALANCE_CODE)
                        .responseMessage(AccountUtils.INSUFFICIENT_BALANCE_MESSAGE)
                        .accountInfo(null)
                        .build();
            }else{
                userToDebit.setAccountBalance(userToDebit.getAccountBalance().subtract(request.getAmount()));
                userRepo.save(userToDebit);

                TransactionDTO transactionDTO = TransactionDTO.builder()
                        .accountNumber(userToDebit.getAccountNumber())
                        .receiver(userToDebit.getFirstName()+" "+userToDebit.getLastName())
                        .transactionType("DEBIT")
                        .amount(request.getAmount())
                        .status("SUCCESS")
                        .build();
                transactionService.saveTransaction(transactionDTO);

            }
            return BankResponse.builder()
                    .responseCode(AccountUtils.AMOUNT_DEBITED_SUCCESS_CODE)
                    .responseMessage(AccountUtils.AMOUNT_DEBITED_SUCCESS_MESSAGE)
                    .accountInfo(AccountInfo.builder()
                            .accountName(userToDebit.getFirstName()+" "+userToDebit.getLastName())
                            .accountNumber(userToDebit.getAccountNumber())
                            .accountBalance(userToDebit.getAccountBalance())
                            .build())
                    .build();
        }
    }

    @Override
    public BankResponse transfer(TransferRequest request) {
        if(!userRepo.existsByAccountNumber(request.getSourceAccountNumber()) && !userRepo.existsByAccountNumber(request.getDestinationAccountNumber())){
            return BankResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_NOT_EXISTS)
                    .responseMessage(AccountUtils.ACCOUNT_NOT_EXISTS_MESSAGE)
                    .accountInfo(null)
                    .build();
        }
        User userToDebit = userRepo.findByAccountNumber(request.getSourceAccountNumber());
        int comparisonResult = userToDebit.getAccountBalance().compareTo(request.getAmount());
        boolean passwordCheck = userToDebit.getPassword().equals(request.getPassword());

        if (comparisonResult < 0 && !passwordCheck){
            return BankResponse.builder()
                    .responseCode(AccountUtils.INSUFFICIENT_BALANCE_CODE)
                    .responseMessage(AccountUtils.INSUFFICIENT_BALANCE_MESSAGE)
                    .accountInfo(null)
                    .build();
        }else{
            userToDebit.setAccountBalance(userToDebit.getAccountBalance().subtract(request.getAmount()));
            User sourceUser = userRepo.save(userToDebit);
            EmailDTO sourceEmailDetails = EmailDTO.builder()
                    .recipient(sourceUser.getEmail())
                    .subject("Amount Debited")
                    .messageBody("The sum of "+request.getAmount()+" is debited from your account. Your current balance is "+sourceUser.getAccountBalance())
                    .build();
            emailService.sendEmailAlert(sourceEmailDetails);

            User userToCredit = userRepo.findByAccountNumber(request.getDestinationAccountNumber());

            TransactionDTO transactionDTOCredit = TransactionDTO.builder()
                    .receiver(userToCredit.getFirstName()+" "+userToCredit.getLastName())
                    .accountNumber(sourceUser.getAccountNumber())
                    .transactionType("DEBIT")
                    .amount(request.getAmount())
                    .status("SUCCESS")
                    .build();
            System.out.println("YYYY");
            transactionService.saveTransaction(transactionDTOCredit);


            userToCredit.setAccountBalance(userToCredit.getAccountBalance().add(request.getAmount()));
            User destinationUser = userRepo.save(userToCredit);
            EmailDTO destinationEmailDetails = EmailDTO.builder()
                    .recipient(destinationUser.getEmail())
                    .subject("Amount Credited")
                    .messageBody("The sum of "+request.getAmount()+" is credited to your account. Your current balance is "+destinationUser.getAccountBalance())
                    .build();
            emailService.sendEmailAlert(destinationEmailDetails);

            TransactionDTO transactionDTODebit = TransactionDTO.builder()
                    .receiver(sourceUser.getFirstName()+" "+sourceUser.getLastName())
                    .accountNumber(userToCredit.getAccountNumber())
                    .transactionType("CREDIT")
                    .amount(request.getAmount())
                    .status("SUCCESS")
                    .build();
            transactionService.saveTransaction(transactionDTODebit);


            return BankResponse.builder()
                    .responseCode(AccountUtils.TRANSFER_SUCCESS_CODE)
                    .responseMessage(AccountUtils.TRANSFER_SUCCESS_MESSAGE)
                    .accountInfo(null)
                    .build();
        }
    }
}
