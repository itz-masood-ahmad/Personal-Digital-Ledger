package com.ledger.digital.personal.controller;

import com.ledger.digital.personal.dto.InvestmentDto;
import com.ledger.digital.personal.service.InvestmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/investments")
@Tag(name = "Investments", description = "Endpoints for managing user investments")
public class InvestmentController {

    private final InvestmentService investmentService;

    public InvestmentController(InvestmentService investmentService) {
        this.investmentService = investmentService;
    }

    @PostMapping
    @Operation(summary = "Create a new investment",
            description = "Create a new investment for the user with optional linked account and budget")
    public ResponseEntity<InvestmentDto> create(
            @RequestBody
            @Parameter(description = "Investment data to create") InvestmentDto dto,
            @RequestParam(name = "userEmail") // FIXED: Added name
            @Parameter(description = "User's email to associate the investment with") String userEmail) {
        return ResponseEntity.ok(investmentService.createInvestment(dto, userEmail));
    }

    @GetMapping
    @Operation(summary = "List all investments",
            description = "Get a list of all investments associated with the given user email")
    public ResponseEntity<List<InvestmentDto>> list(
            @RequestParam(name = "userEmail") // FIXED: Added name
            @Parameter(description = "User's email to fetch investments for") String userEmail) {
        return ResponseEntity.ok(investmentService.listInvestments(userEmail));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an investment",
            description = "Update investment value and optionally link account or budget")
    public ResponseEntity<InvestmentDto> update(
            @PathVariable(name = "id") // FIXED: Added name
            @Parameter(description = "ID of the investment to update") Long id,
            @RequestParam(name = "changeAmount") // FIXED: Added name
            @Parameter(description = "Amount to add or remove from the investment") BigDecimal changeAmount,
            @RequestParam(name = "accountId", required = false) // FIXED: Added name
            @Parameter(description = "Optional account ID to deduct amount from") Long accountId,
            @RequestParam(name = "budgetId", required = false) // FIXED: Added name
            @Parameter(description = "Optional budget ID to deduct amount from") Long budgetId,
            @RequestParam(name = "addToAccount") // FIXED: Added name
            @Parameter(description = "Whether the amount should be deducted from the account") boolean addToAccount,
            @RequestParam(name = "userEmail") // FIXED: Added name
            @Parameter(description = "User's email associated with the investment") String userEmail) {
        return ResponseEntity.ok(
                investmentService.updateInvestment(id, changeAmount, addToAccount, accountId, budgetId, userEmail)
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Close an investment",
            description = "Close the investment and optionally add the value back to the account")
    public ResponseEntity<InvestmentDto> close(
            @PathVariable(name = "id") // FIXED: Added name
            @Parameter(description = "ID of the investment to close") Long id,
            @RequestParam(name = "addToAccount") // FIXED: Added name
            @Parameter(description = "Whether the investment value should be added back to the account") boolean addToAccount,
            @RequestParam(name = "userEmail") // FIXED: Added name
            @Parameter(description = "User's email associated with the investment") String userEmail) {
        return ResponseEntity.ok(investmentService.closeInvestment(id, addToAccount, userEmail));
    }
}