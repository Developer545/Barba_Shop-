package com.barbershop.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "barber_exceptions")
public class BarberException {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barber_profile_id", nullable = false)
    private BarberProfile barberProfile;

    @Column(name = "exception_date", nullable = false)
    private LocalDate exceptionDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = false; // false = no disponible, true = disponible (sobrescribe horario)

    @Column(name = "reason")
    private String reason; // Motivo: "Permiso", "Vacaciones", "Enfermedad", etc.

    @Column(name = "all_day", nullable = false)
    private Boolean allDay = false; // true = todo el día, false = solo el rango de horas

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public BarberException() {}

    public BarberException(BarberProfile barberProfile, LocalDate exceptionDate, Boolean isAvailable, Boolean allDay) {
        this.barberProfile = barberProfile;
        this.exceptionDate = exceptionDate;
        this.isAvailable = isAvailable;
        this.allDay = allDay;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BarberProfile getBarberProfile() { return barberProfile; }
    public void setBarberProfile(BarberProfile barberProfile) { this.barberProfile = barberProfile; }

    public LocalDate getExceptionDate() { return exceptionDate; }
    public void setExceptionDate(LocalDate exceptionDate) { this.exceptionDate = exceptionDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Boolean getAllDay() { return allDay; }
    public void setAllDay(Boolean allDay) { this.allDay = allDay; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
