package com.bank.itc.service;

import com.bank.itc.dto.EmailDTO;

public interface EmailService {
    void sendEmailAlert(EmailDTO emailDetails);
}
