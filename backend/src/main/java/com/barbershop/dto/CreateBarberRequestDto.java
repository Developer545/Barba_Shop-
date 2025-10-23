package com.barbershop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class CreateBarberRequestDto {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotNull(message = "Experience is required")
    @Min(value = 0, message = "Experience must be at least 0")
    private Integer experience;

    private List<String> specialties;
    private String description;

    // Constructors
    public CreateBarberRequestDto() {}

    public CreateBarberRequestDto(String name, String email, String phone, Integer experience) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.experience = experience;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }

    public List<String> getSpecialties() { return specialties; }
    public void setSpecialties(List<String> specialties) { this.specialties = specialties; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}