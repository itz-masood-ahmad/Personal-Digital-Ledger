package com.ledger.digital.personal.service;

import com.ledger.digital.personal.dto.ChangePasswordDto;
import com.ledger.digital.personal.dto.LoginDto;
import com.ledger.digital.personal.dto.LoginResponseDto;
import com.ledger.digital.personal.dto.RegisterDto;
import com.ledger.digital.personal.model.ForgotPasswordToken;
import com.ledger.digital.personal.model.User;
import com.ledger.digital.personal.repo.ForgotPasswordTokenRepository;
import com.ledger.digital.personal.repo.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final ForgotPasswordTokenRepository tokenRepository;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder encoder,
                       JavaMailSender mailSender,
                       ForgotPasswordTokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = encoder;
        this.mailSender = mailSender;
        this.tokenRepository = tokenRepository;
    }

    // 🟢 Helper Method: Validate Password Rules
    private void validatePassword(String password) {
        if (password == null) {
            throw new RuntimeException("Password cannot be empty");
        }
        if (password.length() < 8 || password.length() > 16) {
            throw new RuntimeException("Password must be between 8 and 16 characters long");
        }
        // Regex checks for at least one letter and at least one number
        // ^(?=.*[a-zA-Z])(?=.*[0-9]).+$
        if (!Pattern.matches("^(?=.*[a-zA-Z])(?=.*[0-9]).+$", password)) {
            throw new RuntimeException("Password must contain at least one letter and one number");
        }
    }

    // REGISTER
    public LoginResponseDto register(RegisterDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with this email");
        }

        // 🟢 Validate Password Rules
        validatePassword(dto.getPassword());

        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setApiKey(UUID.randomUUID().toString().replace("-", ""));

        userRepository.save(user);

        return new LoginResponseDto(
                "Registration successful",
                user.getEmail(),
                user.getApiKey()
        );
    }

    // LOGIN
    public LoginResponseDto login(LoginDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new LoginResponseDto(
                "Login successful",
                user.getEmail(),
                user.getApiKey()
        );
    }

    // CHANGE PASSWORD
    public void changePassword(String email, ChangePasswordDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // 🟢 Validate New Password Rules
        validatePassword(dto.getNewPassword());

        if (!dto.getNewPassword().equals(dto.getConfirmNewPassword())) {
            throw new RuntimeException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    // FORGOT PASSWORD LINK
    public void sendForgotPasswordLink(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        ForgotPasswordToken forgotToken = new ForgotPasswordToken();
        forgotToken.setEmail(email);
        forgotToken.setToken(token);
        forgotToken.setExpiry(expiry);

        tokenRepository.save(forgotToken);

        // Note: For production, change localhost to your deployed frontend URL if different
        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Password Reset Request");
        message.setText("Click this link to reset your password (valid 5 minutes): " + resetLink);
        // message.setFrom("your-email@example.com"); // Configure in application.properties
        mailSender.send(message);
    }

    // RESET PASSWORD
    public void resetPassword(String token, ChangePasswordDto dto) {
        ForgotPasswordToken fpt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (fpt.getExpiry().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(fpt);
            throw new RuntimeException("Token expired");
        }

        User user = userRepository.findByEmail(fpt.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🟢 Validate New Password Rules
        validatePassword(dto.getNewPassword());

        if (!dto.getNewPassword().equals(dto.getConfirmNewPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        tokenRepository.delete(fpt);
    }

    public User getUserByApiKey(String apiKey) {
        return userRepository.findByApiKey(apiKey)
                .orElseThrow(() -> new RuntimeException("Invalid API key"));
    }
}