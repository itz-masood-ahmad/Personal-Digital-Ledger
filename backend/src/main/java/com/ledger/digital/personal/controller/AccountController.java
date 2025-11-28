package com.ledger.digital.personal.controller;

import com.ledger.digital.personal.dto.AccountDto;
import com.ledger.digital.personal.model.User;
import com.ledger.digital.personal.service.AccountService;
import com.ledger.digital.personal.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Accounts", description = "Endpoints to manage user accounts")
public class AccountController {

    private final AccountService accountService;
    private final AuthService authService;

    public AccountController(AccountService accountService, AuthService authService) {
        this.accountService = accountService;
        this.authService = authService;
    }

    @PostMapping
    @Operation(summary = "Create a new account", description = "Create a new account for the logged-in user. Requires X-API-KEY header.")
    public ResponseEntity<AccountDto> createAccount(@RequestBody AccountDto dto,
                                                    @RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.getUserByApiKey(apiKey);
        return ResponseEntity.ok(accountService.createAccount(dto, user.getEmail()));
    }

    @GetMapping
    @Operation(summary = "Get all accounts", description = "Get a list of all accounts belonging to the logged-in user. Requires X-API-KEY header.")
    public ResponseEntity<List<AccountDto>> getAllAccounts(@RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.getUserByApiKey(apiKey);
        return ResponseEntity.ok(accountService.getAllAccounts(user.getEmail()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get account by ID", description = "Retrieve a specific account by its ID for the logged-in user. Requires X-API-KEY header.")
    public ResponseEntity<AccountDto> getAccount(@PathVariable("id") Long id,
                                                 @RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.getUserByApiKey(apiKey);
        return ResponseEntity.ok(accountService.getAccount(id, user.getEmail()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update account", description = "Update an account's details. Requires X-API-KEY header for authentication.")
    public ResponseEntity<AccountDto> updateAccount(@PathVariable("id") Long id,
                                                    @RequestBody AccountDto dto,
                                                    @RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.getUserByApiKey(apiKey);
        return ResponseEntity.ok(accountService.updateAccount(id, dto, user.getEmail()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete account", description = "Delete an account by ID. Requires X-API-KEY header for authentication.")
    public ResponseEntity<String> deleteAccount(@PathVariable("id") Long id,
                                                @RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.getUserByApiKey(apiKey);
        accountService.deleteAccount(id, user.getEmail());
        return ResponseEntity.ok("Account deleted successfully");
    }
}
