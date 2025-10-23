package com.barbershop.controller;

import com.barbershop.dto.AuthResponseDto;
import com.barbershop.dto.LoginRequestDto;
import com.barbershop.dto.RegisterRequestDto;
import com.barbershop.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        try {
            AuthResponseDto response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto registerRequest) {
        try {
            AuthResponseDto response = authService.register(registerRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/hash-password")
    public ResponseEntity<String> hashPassword(@RequestParam String password) {
        return ResponseEntity.ok(authService.hashPassword(password));
    }

    @PostMapping("/update-passwords")
    public ResponseEntity<String> updateAllPasswords() {
        try {
            authService.updateAllUserPasswords();
            return ResponseEntity.ok("All passwords updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update passwords: " + e.getMessage());
        }
    }
}