package com.barbershop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "barber_profiles")
public class BarberProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "barber_specialties", joinColumns = @JoinColumn(name = "barber_profile_id"))
    @Column(name = "specialty")
    private List<String> specialties;

    @DecimalMin(value = "0.0", message = "Rating must be at least 0.0")
    @DecimalMax(value = "5.0", message = "Rating must be at most 5.0")
    @Column(precision = 2, scale = 1)
    private BigDecimal rating = BigDecimal.valueOf(5.0);

    @Min(value = 0, message = "Experience must be at least 0")
    @Column(nullable = false)
    private Integer experience;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "barberProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BarberSchedule> schedule;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public BarberProfile() {}

    public BarberProfile(User user, Integer experience) {
        this.user = user;
        this.experience = experience;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public List<BarberSchedule> getSchedule() { return schedule; }
    public void setSchedule(List<BarberSchedule> schedule) { this.schedule = schedule; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}