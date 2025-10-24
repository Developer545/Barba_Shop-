package com.barbershop.controller;

import com.barbershop.dto.AuthResponseDto;
import com.barbershop.dto.LoginRequestDto;
import com.barbershop.dto.RegisterRequestDto;
import com.barbershop.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
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

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            if (!StringUtils.hasText(request.getRefreshToken())) {
                return ResponseEntity.badRequest().build();
            }
            AuthResponseDto response = authService.refreshToken(request.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        try {
            String bearerToken = request.getHeader("Authorization");
            if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                String token = bearerToken.substring(7);
                authService.logout(token);
                return ResponseEntity.ok("Logged out successfully");
            }
            return ResponseEntity.badRequest().body("No token provided");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Logout failed: " + e.getMessage());
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Boolean> validateToken(HttpServletRequest request) {
        try {
            String bearerToken = request.getHeader("Authorization");
            if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                String token = bearerToken.substring(7);
                boolean isValid = !authService.isTokenBlacklisted(token);
                return ResponseEntity.ok(isValid);
            }
            return ResponseEntity.ok(false);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    // Helper DTO for refresh token request
    public static class RefreshTokenRequest {
        private String refreshToken;

        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    }
}