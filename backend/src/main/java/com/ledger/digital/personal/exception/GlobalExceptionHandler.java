package com.ledger.digital.personal.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 1. Handle Validation Errors (e.g. Missing email, blank password)
    // We WANT the user to see exactly what they did wrong.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> response = new HashMap<>();

        // Get the first specific error (e.g., "Email is required")
        var fieldError = ex.getBindingResult().getFieldError();
        String errorMessage = fieldError != null ? fieldError.getDefaultMessage() : "Invalid request data";

        response.put("error", "Validation Failed");
        response.put("message", errorMessage);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 2. Handle Business Logic Errors (e.g. "User already exists", "Invalid credentials")
    // These are thrown intentionally by your Service layer, so we WANT to show the message.
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> response = new HashMap<>();

        response.put("error", "Operation Failed");
        response.put("message", ex.getMessage()); // Pass the specific service message

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 3. Handle Global/System Errors (e.g. NullPointer, Database down)
    // We DO NOT want to show the user the internal "NullPointerException" text.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(Exception ex) {
        Map<String, String> response = new HashMap<>();

        // Log the real error internally for debugging (optional)
        ex.printStackTrace();

        response.put("error", "Internal Server Error");
        response.put("message", "An unexpected system error occurred. Please try again later."); // Generic safe message

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}