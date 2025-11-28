package com.ledger.digital.personal.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Home", description = "Basic API health and info endpoint")
public class HomeController {

    @GetMapping("/")
    @Operation(summary = "API Health Check", description = "Returns a simple message to confirm the API is running")
    public String home() {
        return "Personal Digital Ledger - API running";
    }
}
