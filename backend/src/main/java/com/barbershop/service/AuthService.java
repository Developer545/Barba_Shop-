package com.barbershop.service;

import com.barbershop.config.JwtTokenProvider;
import com.barbershop.dto.*;
import com.barbershop.entity.RefreshToken;
import com.barbershop.entity.Role;
import com.barbershop.entity.TokenBlacklist;
import com.barbershop.entity.User;
import com.barbershop.repository.RefreshTokenRepository;
import com.barbershop.repository.RoleRepository;
import com.barbershop.repository.TokenBlacklistRepository;
import com.barbershop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private TokenBlacklistRepository tokenBlacklistRepository;

    public AuthResponseDto login(LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate and save refresh token
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());
        LocalDateTime refreshTokenExpiry = jwtTokenProvider.getRefreshTokenExpiryDate();

        // Revoke previous refresh token if exists
        refreshTokenRepository.findByUserAndIsRevokedFalse(user).ifPresent(token -> {
            token.setIsRevoked(true);
            refreshTokenRepository.save(token);
        });

        // Save new refresh token
        RefreshToken newRefreshToken = new RefreshToken(refreshToken, user, refreshTokenExpiry);
        refreshTokenRepository.save(newRefreshToken);

        UserDto userDto = convertToUserDto(user);
        AuthResponseDto response = new AuthResponseDto(jwt, userDto);
        response.setRefreshToken(refreshToken);

        return response;
    }

    public AuthResponseDto register(RegisterRequestDto registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        // Obtener el rol CLIENT por defecto
        Role clientRole = roleRepository.findByName("CLIENT")
            .orElseThrow(() -> new RuntimeException("CLIENT role not found"));

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhone(registerRequest.getPhone());
        user.setRole(clientRole); // Por defecto, nuevos usuarios son clientes
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        String jwt = jwtTokenProvider.generateTokenFromUsername(savedUser.getEmail());
        UserDto userDto = convertToUserDto(savedUser);

        return new AuthResponseDto(jwt, userDto);
    }

    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public void updateAllUserPasswords() {
        // Update all users to have password123 as password
        String correctHash = "$2a$10$seCJCqfVr8F3ecyhAUaVLOPH1zxhheX9OmAHvDsxCYI/jFbC/tTRa";

        String[] emails = {
            "admin@barbershop.com",
            "miguel@barbershop.com",
            "carlos@barbershop.com",
            "roberto@barbershop.com",
            "juan@email.com",
            "ana@email.com",
            "pedro@email.com"
        };

        for (String email : emails) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                user.setPassword(correctHash);
                userRepository.save(user);
            }
        }
    }

    public AuthResponseDto refreshToken(String refreshToken) {
        // Check if token is blacklisted
        if (tokenBlacklistRepository.existsByToken(refreshToken)) {
            throw new RuntimeException("Refresh token has been revoked");
        }

        // Validate refresh token
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
            .orElseThrow(() -> new RuntimeException("Refresh token not found in database"));

        if (storedToken.getIsRevoked() || storedToken.isExpired()) {
            throw new RuntimeException("Refresh token is invalid or expired");
        }

        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate new JWT token
        String newJwt = jwtTokenProvider.generateTokenFromUsername(username);

        UserDto userDto = convertToUserDto(user);
        AuthResponseDto response = new AuthResponseDto(newJwt, userDto);
        response.setRefreshToken(refreshToken);

        return response;
    }

    public void logout(String token) {
        try {
            // Validate token format
            if (!jwtTokenProvider.validateToken(token)) {
                throw new RuntimeException("Invalid token");
            }

            // Get token expiry date
            LocalDateTime expiryDate = LocalDateTime.now();
            if (jwtTokenProvider.isTokenExpired(token)) {
                expiryDate = LocalDateTime.now().plusSeconds(3600); // 1 hour buffer
            } else {
                // Token will expire in jwt.expiration milliseconds
                expiryDate = LocalDateTime.now().plusSeconds(900); // 15 minutes (default token expiration)
            }

            // Add token to blacklist
            TokenBlacklist blacklistedToken = new TokenBlacklist(token, expiryDate, "logout");
            tokenBlacklistRepository.save(blacklistedToken);

            // Revoke associated refresh tokens
            String username = jwtTokenProvider.getUsernameFromToken(token);
            User user = userRepository.findByEmail(username).orElse(null);
            if (user != null) {
                refreshTokenRepository.findByUserAndIsRevokedFalse(user).ifPresent(refreshToken -> {
                    refreshToken.setIsRevoked(true);
                    refreshTokenRepository.save(refreshToken);
                });
            }

            // Clear security context
            SecurityContextHolder.clearContext();
        } catch (Exception ex) {
            System.err.println("Error during logout: " + ex.getMessage());
        }
    }

    public boolean isTokenBlacklisted(String token) {
        return tokenBlacklistRepository.existsByToken(token);
    }

    // Clean up expired tokens (should be called periodically)
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        tokenBlacklistRepository.deleteByExpiryDateBefore(now);
        refreshTokenRepository.deleteByExpiryDateBefore(now);
    }

    private UserDto convertToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setPhone(user.getPhone());
        userDto.setRole(user.getRole().getName()); // Convertir Role a String
        userDto.setAvatar(user.getAvatar());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setIsActive(user.getIsActive());
        return userDto;
    }
}