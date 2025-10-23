package com.barbershop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.LocalTime;

@Entity
@Table(name = "barber_schedules")
public class BarberSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barber_profile_id", nullable = false)
    private BarberProfile barberProfile;

    @Min(value = 0, message = "Day of week must be between 0 (Sunday) and 6 (Saturday)")
    @Max(value = 6, message = "Day of week must be between 0 (Sunday) and 6 (Saturday)")
    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek; // 0 = domingo, 1 = lunes, etc.

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    // Constructors
    public BarberSchedule() {}

    public BarberSchedule(BarberProfile barberProfile, Integer dayOfWeek, LocalTime startTime, LocalTime endTime) {
        this.barberProfile = barberProfile;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BarberProfile getBarberProfile() { return barberProfile; }
    public void setBarberProfile(BarberProfile barberProfile) { this.barberProfile = barberProfile; }

    public Integer getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}