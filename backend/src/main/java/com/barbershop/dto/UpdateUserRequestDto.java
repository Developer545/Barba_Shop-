package com.barbershop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateUserRequestDto {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Role is required")
    private String role; // ADMIN, BARBER, CLIENT

    private String avatar;

    private String password; // Optional - only if user wants to change password

    // Constructors
    public UpdateUserRequestDto() {}

    public UpdateUserRequestDto(String name, String email, String phone, String role, String avatar, String password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.avatar = avatar;
        this.password = password;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
