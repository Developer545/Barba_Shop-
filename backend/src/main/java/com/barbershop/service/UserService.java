package com.barbershop.service;

import com.barbershop.dto.CreateUserRequestDto;
import com.barbershop.dto.UpdateUserRequestDto;
import com.barbershop.dto.UserDto;
import com.barbershop.entity.Role;
import com.barbershop.entity.User;
import com.barbershop.repository.RoleRepository;
import com.barbershop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::convertToUserDto)
            .collect(Collectors.toList());
    }

    public List<UserDto> getUsersByRole(String roleName) {
        Role role = roleRepository.findByName(roleName)
            .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        return userRepository.findByRoleAndIsActiveTrue(role).stream()
            .map(this::convertToUserDto)
            .collect(Collectors.toList());
    }

    public List<UserDto> getUsersByRoleName(String roleName) {
        return userRepository.findActiveUsersByRoleName(roleName).stream()
            .map(this::convertToUserDto)
            .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToUserDto(user);
    }

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return convertToUserDto(user);
    }

    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setIsActive(false);
        userRepository.save(user);
    }

    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setIsActive(true);
        userRepository.save(user);
    }

    public long getTotalUserCount() {
        return userRepository.count();
    }

    public long getUserCountByRoleName(String roleName) {
        return userRepository.countByRoleName(roleName);
    }

    public UserDto createUser(CreateUserRequestDto request) {
        // Verificar si el email ya existe
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        // Obtener el rol especificado
        Role role = roleRepository.findByName(request.getRole())
            .orElseThrow(() -> new RuntimeException("Role not found: " + request.getRole()));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setAvatar(request.getAvatar());
        user.setIsActive(true);

        User savedUser = userRepository.save(user);
        return convertToUserDto(savedUser);
    }

    public UserDto updateUser(Long userId, UpdateUserRequestDto request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Verificar si el email ya está en uso por otro usuario
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken by another user!");
        }

        // Obtener el rol especificado
        Role role = roleRepository.findByName(request.getRole())
            .orElseThrow(() -> new RuntimeException("Role not found: " + request.getRole()));

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(role);

        // Update avatar if provided
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            user.setAvatar(request.getAvatar());
        }

        // Update password only if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return convertToUserDto(updatedUser);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        userRepository.delete(user);
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