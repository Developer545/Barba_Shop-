package com.barbershop.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BarberScheduleDto {
    private Long id;
    private Integer dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;

    // Constructors
    public BarberScheduleDto() {}

    public BarberScheduleDto(Integer dayOfWeek, LocalTime startTime, LocalTime endTime, Boolean isAvailable) {
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isAvailable = isAvailable;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}