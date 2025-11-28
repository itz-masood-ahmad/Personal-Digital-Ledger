package com.ledger.digital.personal.controller;

import com.ledger.digital.personal.dto.DebtDto;
import com.ledger.digital.personal.service.DebtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/debts")
@Tag(name = "Debts", description = "Manage user debts")
public class DebtController {

    private final DebtService debtService;

    public DebtController(DebtService debtService) {
        this.debtService = debtService;
    }

    @PostMapping
    @Operation(summary = "Add a new debt", description = "Create a new debt entry")
    public ResponseEntity<DebtDto> create(@Valid @RequestBody DebtDto dto,
                                          @RequestHeader("userEmail") String userEmail,
                                          @RequestParam(name = "accountId", required = false) Long accountId) { // 🟢 Added accountId
        return ResponseEntity.ok(debtService.addDebt(dto, userEmail, accountId));
    }

    @GetMapping
    @Operation(summary = "List all debts")
    public ResponseEntity<List<DebtDto>> list(@RequestHeader("userEmail") String userEmail) {
        return ResponseEntity.ok(debtService.getDebts(userEmail));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a debt", description = "Update debt details and optionally adjust linked account")
    public ResponseEntity<DebtDto> modify(
            @PathVariable("id") Long id,
            @Valid @RequestBody DebtDto dto,
            @RequestHeader("userEmail") String userEmail,
            @RequestParam(name = "accountId", required = false) Long accountId) { // 🟢 Added accountId

        return ResponseEntity.ok(debtService.updateDebt(id, dto, userEmail, accountId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Close a debt", description = "Remove a debt, optionally settling via account")
    public ResponseEntity<Void> close(
            @PathVariable("id") Long id,
            @RequestHeader("userEmail") String userEmail,
            @RequestParam(name = "accountId", required = false) Long accountId) { // 🟢 Added accountId

        debtService.closeDebt(id, userEmail, accountId);
        return ResponseEntity.noContent().build();
    }
}