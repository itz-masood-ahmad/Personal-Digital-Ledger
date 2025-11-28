package com.ledger.digital.personal.controller;

import com.ledger.digital.personal.dto.BudgetDto;
import com.ledger.digital.personal.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@Tag(name = "Budgets", description = "Manage user budgets: create, list, update, and close budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    @Operation(summary = "Create a budget", description = "Create a new budget for a user identified by their email.")
    public ResponseEntity<BudgetDto> create(@Valid @RequestBody BudgetDto dto,
                                            @RequestHeader("userEmail") String userEmail) {
        return ResponseEntity.ok(budgetService.createBudget(dto, userEmail));
    }

    @GetMapping
    @Operation(summary = "List all budgets", description = "Retrieve all budgets for a user.")
    public ResponseEntity<List<BudgetDto>> list(@RequestHeader("userEmail") String userEmail) {
        return ResponseEntity.ok(budgetService.getBudgets(userEmail));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a budget", description = "Update an existing budget by ID for a user.")
    public ResponseEntity<BudgetDto> modify(@PathVariable("id") Long id,
                                            @Valid @RequestBody BudgetDto dto,
                                            @RequestHeader("userEmail") String userEmail) {
        return ResponseEntity.ok(budgetService.updateBudget(id, dto, userEmail));
    }

    @PostMapping("/close/{id}")
    @Operation(summary = "Close a budget", description = "Close a budget by ID and optionally transfer remaining amount to a specific account.")
    public ResponseEntity<Void> close(@PathVariable("id") Long id,
                                      @RequestParam("addRemainingToAccount") boolean addRemainingToAccount,
                                      @RequestParam(required = false, name = "accountId") Long accountId,
                                      @RequestHeader("userEmail") String userEmail) {
        budgetService.closeBudget(id, userEmail, addRemainingToAccount, accountId);
        return ResponseEntity.noContent().build();
    }
}
