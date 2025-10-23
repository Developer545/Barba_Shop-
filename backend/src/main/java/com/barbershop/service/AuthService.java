package com.barbershop.service;

import com.barbershop.config.JwtTokenProvider;
import com.barbershop.dto.*;
import com.barbershop.entity.Role;
import com.barbershop.entity.User;
import com.barbershop.repository.RoleRepository;
import com.barbershop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        UserDto userDto = convertToUserDto(user);

        return new AuthResponseDto(jwt, userDto);
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