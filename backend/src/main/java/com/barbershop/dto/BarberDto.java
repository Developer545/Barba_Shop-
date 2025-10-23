package com.barbershop.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BarberDto {
    private Long id;
    private Long userId; // ID del usuario asociado (para crear citas)
    private String name;
    private String email;
    private String phone;
    private String avatar;
    private List<String> specialties;
    private BigDecimal rating;
    private Integer experience;
    private String description;
    private Boolean isActive;
    private List<BarberScheduleDto> schedule;

    // Constructors
    public BarberDto() {}

    public BarberDto(Long id, String name, String email, String phone, Integer experience) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.experience = experience;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public List<String> getSpecialties() { return specialties; }
    public void setSpecialties(List<String> specialties) { this.specialties = specialties; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public List<BarberScheduleDto> getSchedule() { return schedule; }
    public void setSchedule(List<BarberScheduleDto> schedule) { this.schedule = schedule; }
}