package com.ledger.digital.personal.controller;

import com.ledger.digital.personal.dto.CreditDto;
import com.ledger.digital.personal.model.User;
import com.ledger.digital.personal.service.AuthService;
import com.ledger.digital.personal.service.CreditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credits")
@Tag(name = "Credits", description = "Manage user credits: add, list, view, and delete credits")
public class CreditController {

    private final CreditService creditService;
    private final AuthService authService;

    public CreditController(CreditService creditService, AuthService authService) {
        this.creditService = creditService;
        this.authService = authService;
    }

    @PostMapping("/{accountId}")
    @Operation(summary = "Add a credit", description = "Add a credit entry to a specific account. Requires API key authentication.")
    public ResponseEntity<CreditDto> create(@PathVariable("accountId") Long accountId,
                                            @RequestHeader("X-API-KEY") String apiKey,
                                            @Valid @RequestBody CreditDto dto) {
        User user = authService.getUserByApiKey(apiKey);
        return ResponseEntity.ok(creditService.addCredit(accountId, dto, user.getEmail()));
    }

    @GetMapping
    @Operation(summary = "List all credits", description = "List all credits for the authenticated user.")
    public ResponseEntity<List<CreditDto>> list(@RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.getUserByApiKey(apiKey);
        return ResponseEntity.ok(creditService.list(user.getEmail()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a credit by ID", description = "Retrieve a single credit entry by its ID for the authenticated user.")
    public ResponseEntity<CreditDto> get(@PathVariable("id") Long id,
                                         @RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.getUserByApiKey(apiKey);
        return ResponseEntity.ok(creditService.get(id, user.getEmail()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a credit", description = "Delete a credit entry by ID. Requires API key authentication.")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id,
                                       @RequestHeader("X-API-KEY") String apiKey) {
        User user = authService.getUserByApiKey(apiKey);
        creditService.delete(id, user.getEmail());
        return ResponseEntity.noContent().build();
    }
}
