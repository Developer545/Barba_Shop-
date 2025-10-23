package com.barbershop.service;

import com.barbershop.dto.*;
import com.barbershop.entity.*;
import com.barbershop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ScheduleService {

    @Autowired
    private BarberScheduleRepository barberScheduleRepository;

    @Autowired
    private BarberExceptionRepository barberExceptionRepository;

    @Autowired
    private BarberProfileRepository barberProfileRepository;

    // ===================== GESTIÓN DE HORARIOS SEMANALES (PERMANENTES) =====================

    public List<BarberScheduleDto> getBarberSchedule(Long barberProfileId) {
        return barberScheduleRepository.findByBarberProfileIdOrderByDayOfWeekAscStartTimeAsc(barberProfileId)
            .stream()
            .map(this::convertToBarberScheduleDto)
            .collect(Collectors.toList());
    }

    public BarberScheduleDto createBarberSchedule(Long barberProfileId, UpdateBarberScheduleRequestDto request) {
        BarberProfile barberProfile = barberProfileRepository.findById(barberProfileId)
            .orElseThrow(() -> new RuntimeException("Barber not found with id: " + barberProfileId));

        BarberSchedule schedule = new BarberSchedule();
        schedule.setBarberProfile(barberProfile);
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setIsAvailable(request.getIsAvailable());

        BarberSchedule savedSchedule = barberScheduleRepository.save(schedule);
        return convertToBarberScheduleDto(savedSchedule);
    }

    public BarberScheduleDto updateBarberSchedule(Long scheduleId, UpdateBarberScheduleRequestDto request) {
        BarberSchedule schedule = barberScheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));

        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setIsAvailable(request.getIsAvailable());

        BarberSchedule savedSchedule = barberScheduleRepository.save(schedule);
        return convertToBarberScheduleDto(savedSchedule);
    }

    public void deleteBarberSchedule(Long scheduleId) {
        barberScheduleRepository.deleteById(scheduleId);
    }

    public List<BarberScheduleDto> updateFullWeekSchedule(Long barberProfileId, List<UpdateBarberScheduleRequestDto> schedules) {
        BarberProfile barberProfile = barberProfileRepository.findById(barberProfileId)
            .orElseThrow(() -> new RuntimeException("Barber not found with id: " + barberProfileId));

        // Eliminar horarios existentes
        barberScheduleRepository.deleteByBarberProfileId(barberProfileId);

        // Crear nuevos horarios
        List<BarberSchedule> newSchedules = schedules.stream()
            .map(dto -> {
                BarberSchedule schedule = new BarberSchedule();
                schedule.setBarberProfile(barberProfile);
                schedule.setDayOfWeek(dto.getDayOfWeek());
                schedule.setStartTime(dto.getStartTime());
                schedule.setEndTime(dto.getEndTime());
                schedule.setIsAvailable(dto.getIsAvailable());
                return schedule;
            })
            .collect(Collectors.toList());

        List<BarberSchedule> savedSchedules = barberScheduleRepository.saveAll(newSchedules);

        return savedSchedules.stream()
            .map(this::convertToBarberScheduleDto)
            .collect(Collectors.toList());
    }

    // ===================== GESTIÓN DE EXCEPCIONES (TEMPORALES) =====================

    public List<BarberExceptionDto> getBarberExceptions(Long barberProfileId) {
        return barberExceptionRepository.findByBarberProfileIdOrderByExceptionDateAsc(barberProfileId)
            .stream()
            .map(this::convertToBarberExceptionDto)
            .collect(Collectors.toList());
    }

    public List<BarberExceptionDto> getBarberExceptionsByDateRange(Long barberProfileId, LocalDate startDate, LocalDate endDate) {
        return barberExceptionRepository.findByBarberProfileIdAndDateRange(barberProfileId, startDate, endDate)
            .stream()
            .map(this::convertToBarberExceptionDto)
            .collect(Collectors.toList());
    }

    public BarberExceptionDto createBarberException(CreateBarberExceptionRequestDto request) {
        BarberProfile barberProfile = barberProfileRepository.findById(request.getBarberProfileId())
            .orElseThrow(() -> new RuntimeException("Barber not found with id: " + request.getBarberProfileId()));

        BarberException exception = new BarberException();
        exception.setBarberProfile(barberProfile);
        exception.setExceptionDate(request.getExceptionDate());
        exception.setStartTime(request.getStartTime());
        exception.setEndTime(request.getEndTime());
        exception.setIsAvailable(request.getIsAvailable());
        exception.setReason(request.getReason());
        exception.setAllDay(request.getAllDay());

        BarberException savedException = barberExceptionRepository.save(exception);
        return convertToBarberExceptionDto(savedException);
    }

    public BarberExceptionDto updateBarberException(Long exceptionId, CreateBarberExceptionRequestDto request) {
        BarberException exception = barberExceptionRepository.findById(exceptionId)
            .orElseThrow(() -> new RuntimeException("Exception not found with id: " + exceptionId));

        exception.setExceptionDate(request.getExceptionDate());
        exception.setStartTime(request.getStartTime());
        exception.setEndTime(request.getEndTime());
        exception.setIsAvailable(request.getIsAvailable());
        exception.setReason(request.getReason());
        exception.setAllDay(request.getAllDay());

        BarberException savedException = barberExceptionRepository.save(exception);
        return convertToBarberExceptionDto(savedException);
    }

    public void deleteBarberException(Long exceptionId) {
        barberExceptionRepository.deleteById(exceptionId);
    }

    // ===================== LÓGICA DE DISPONIBILIDAD =====================

    /**
     * Verifica si un barbero está disponible en una fecha y hora específica
     * considerando su horario semanal permanente y las excepciones temporales
     */
    public boolean isBarberAvailable(Long barberProfileId, LocalDate date, LocalTime time) {
        // 1. Verificar si hay una excepción para esta fecha
        List<BarberException> exceptions = barberExceptionRepository
            .findByBarberProfileIdAndExceptionDate(barberProfileId, date);

        for (BarberException exception : exceptions) {
            // Si la excepción es para todo el día
            if (exception.getAllDay()) {
                return exception.getIsAvailable();
            }

            // Si la excepción es para un rango de horas específico
            if (exception.getStartTime() != null && exception.getEndTime() != null) {
                if (time.compareTo(exception.getStartTime()) >= 0 && time.compareTo(exception.getEndTime()) < 0) {
                    return exception.getIsAvailable();
                }
            }
        }

        // 2. Si no hay excepciones, verificar el horario semanal permanente
        int dayOfWeek = date.getDayOfWeek().getValue() % 7; // Convertir a 0=domingo, 1=lunes, etc.

        List<BarberSchedule> schedules = barberScheduleRepository
            .findByBarberProfileIdOrderByDayOfWeekAscStartTimeAsc(barberProfileId);

        for (BarberSchedule schedule : schedules) {
            if (schedule.getDayOfWeek().equals(dayOfWeek)) {
                if (!schedule.getIsAvailable()) {
                    return false;
                }

                if (time.compareTo(schedule.getStartTime()) >= 0 && time.compareTo(schedule.getEndTime()) < 0) {
                    return true;
                }
            }
        }

        // 3. Si no hay horario definido para este día, el barbero no está disponible
        return false;
    }

    /**
     * Obtiene los horarios disponibles de un barbero para una fecha específica
     * Retorna lista de bloques de 30 minutos disponibles
     */
    public List<LocalTime> getAvailableTimeSlots(Long barberProfileId, LocalDate date) {
        List<LocalTime> availableSlots = new java.util.ArrayList<>();

        // Obtener horario del día
        int dayOfWeek = date.getDayOfWeek().getValue() % 7;
        List<BarberSchedule> schedules = barberScheduleRepository
            .findByBarberProfileIdOrderByDayOfWeekAscStartTimeAsc(barberProfileId);

        LocalTime startTime = null;
        LocalTime endTime = null;

        for (BarberSchedule schedule : schedules) {
            if (schedule.getDayOfWeek().equals(dayOfWeek) && schedule.getIsAvailable()) {
                startTime = schedule.getStartTime();
                endTime = schedule.getEndTime();
                break;
            }
        }

        if (startTime == null) {
            return availableSlots; // No hay horario para este día
        }

        // Generar slots de 30 minutos
        LocalTime currentTime = startTime;
        while (currentTime.isBefore(endTime)) {
            if (isBarberAvailable(barberProfileId, date, currentTime)) {
                availableSlots.add(currentTime);
            }
            currentTime = currentTime.plusMinutes(30);
        }

        return availableSlots;
    }

    // ===================== CONVERSORES =====================

    private BarberScheduleDto convertToBarberScheduleDto(BarberSchedule schedule) {
        BarberScheduleDto dto = new BarberScheduleDto();
        dto.setId(schedule.getId());
        dto.setDayOfWeek(schedule.getDayOfWeek());
        dto.setStartTime(schedule.getStartTime());
        dto.setEndTime(schedule.getEndTime());
        dto.setIsAvailable(schedule.getIsAvailable());
        return dto;
    }

    private BarberExceptionDto convertToBarberExceptionDto(BarberException exception) {
        BarberExceptionDto dto = new BarberExceptionDto();
        dto.setId(exception.getId());
        dto.setBarberProfileId(exception.getBarberProfile().getId());
        dto.setExceptionDate(exception.getExceptionDate());
        dto.setStartTime(exception.getStartTime());
        dto.setEndTime(exception.getEndTime());
        dto.setIsAvailable(exception.getIsAvailable());
        dto.setReason(exception.getReason());
        dto.setAllDay(exception.getAllDay());
        return dto;
    }
}
