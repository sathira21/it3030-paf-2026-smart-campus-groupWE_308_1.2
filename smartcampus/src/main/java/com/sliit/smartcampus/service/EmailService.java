package com.sliit.smartcampus.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendOtpEmail(String toAddress, String otp) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toAddress);
            helper.setSubject("Your Smart Campus Verification Code");

            String htmlContent = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;\">" +
                    "<h2 style=\"color: #2c3e50; text-align: center;\">Welcome to Smart Campus!</h2>" +
                    "<p style=\"font-size: 16px; color: #34495e;\">Hello,</p>" +
                    "<p style=\"font-size: 16px; color: #34495e;\">Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address and activate your account:</p>" +
                    "<div style=\"text-align: center; margin: 30px 0;\">" +
                    "<span style=\"font-size: 32px; font-weight: bold; color: #3498db; letter-spacing: 5px; padding: 10px 20px; background-color: #f1f8ff; border-radius: 5px; border: 2px dashed #3498db;\">" + otp + "</span>" +
                    "</div>" +
                    "<p style=\"font-size: 14px; color: #7f8c8d;\">This code is valid for your registration. If you did not request this, please ignore this email.</p>" +
                    "<hr style=\"border: none; border-top: 1px solid #eeeeee; margin: 20px 0;\" />" +
                    "<p style=\"font-size: 12px; color: #bdc3c7; text-align: center;\">&copy; 2026 Smart Campus Management System. All rights reserved.</p>" +
                    "</div>";

            helper.setText(htmlContent, true);
            javaMailSender.send(message);
            logger.info("OTP email successfully sent to {}", toAddress);
            
        } catch (MessagingException e) {
            logger.error("Failed to send OTP email to {}", toAddress, e);
        }
    }

    @Async
    public void sendLoginMfaEmail(String toAddress, String otp) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toAddress);
            helper.setSubject("Security Alert: Smart Campus Login Code");

            String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #edf2f7; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);\">" +
                    "<div style=\"text-align: center; margin-bottom: 25px;\">" +
                    "  <h2 style=\"color: #1a202c; font-weight: 700; margin: 0;\">Login Verification</h2>" +
                    "  <p style=\"color: #718096; font-size: 14px; margin-top: 8px;\">Smart Campus Security System</p>" +
                    "</div>" +
                    "<p style=\"font-size: 16px; color: #2d3748;\">Hello,</p>" +
                    "<p style=\"font-size: 16px; color: #4a5568; line-height: 1.6;\">A login attempt was detected for your <strong>Administrator</strong> account. To complete the login, please use the verification code below:</p>" +
                    "<div style=\"text-align: center; margin: 35px 0;\">" +
                    "  <div style=\"display: inline-block; padding: 15px 30px; background-color: #ebf8ff; border: 2px solid #3182ce; border-radius: 8px;\">" +
                    "    <span style=\"font-size: 36px; font-weight: 800; color: #2b6cb0; letter-spacing: 8px; font-family: monospace;\">" + otp + "</span>" +
                    "  </div>" +
                    "</div>" +
                    "<div style=\"background-color: #fffaf0; border-left: 4px solid #ed8936; padding: 15px; margin-bottom: 25px;\">" +
                    "  <p style=\"font-size: 13px; color: #c05621; margin: 0;\"><strong>Warning:</strong> If you did not attempt to log in, please change your password immediately and notify the IT department.</p>" +
                    "</div>" +
                    "<hr style=\"border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;\" />" +
                    "<p style=\"font-size: 11px; color: #a0aec0; text-align: center;\">This is an automated security notification. Please do not reply to this email.</p>" +
                    "</div>";

            helper.setText(htmlContent, true);
            javaMailSender.send(message);
            logger.info("Login MFA email successfully sent to {}. CODE: [{}]", toAddress, otp);
            System.out.println(">>> MFA VERIFICATION CODE FOR " + toAddress + ": " + otp);
            
        } catch (MessagingException e) {
            logger.error("Failed to send Login MFA email to {}", toAddress, e);
            throw new RuntimeException("Error sending security email", e);
        }
    }
}
