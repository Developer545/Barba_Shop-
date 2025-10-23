package com.barbershop.service;

import com.barbershop.dto.BarberDto;
import com.barbershop.dto.BarberScheduleDto;
import com.barbershop.dto.CreateBarberRequestDto;
import com.barbershop.entity.*;
import com.barbershop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BarberService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BarberProfileRepository barberProfileRepository;

    @Autowired
    private BarberScheduleRepository barberScheduleRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<BarberDto> getAllActiveBarbers() {
        return barberProfileRepository.findByIsActiveTrueOrderByRatingDesc().stream()
            .map(this::convertToBarberDto)
            .collect(Collectors.toList());
    }

    public BarberDto getBarberById(Long id) {
        BarberProfile barberProfile = barberProfileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Barber not found with id: " + id));
        return convertToBarberDto(barberProfile);
    }

    public BarberDto getBarberByUserId(Long userId) {
        BarberProfile barberProfile = barberProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Barber profile not found for user id: " + userId));
        return convertToBarberDto(barberProfile);
    }

    public BarberDto createBarber(CreateBarberRequestDto request) {
        // Verificar que el email no esté en uso
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        // DEBUG: Ver qué especialidades llegan
        System.out.println("DEBUG - Specialties received: " + request.getSpecialties());
        System.out.println("DEBUG - Specialties size: " + (request.getSpecialties() != null ? request.getSpecialties().size() : "null"));

        // Obtener el rol BARBER
        Role barberRole = roleRepository.findByName("BARBER")
            .orElseThrow(() -> new RuntimeException("BARBER role not found"));

        // Crear usuario
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Usar la contraseña del request
        user.setPhone(request.getPhone());
        user.setRole(barberRole);
        user.setIsActive(true);
        user.setAvatar(request.getAvatar() != null ? request.getAvatar() : generateAvatarUrl(request.getName())); // Usar avatar del request si está disponible

        User savedUser = userRepository.save(user);

        // Crear perfil de barbero
        BarberProfile barberProfile = new BarberProfile();
        barberProfile.setUser(savedUser);
        barberProfile.setExperience(request.getExperience());
        barberProfile.setSpecialties(request.getSpecialties());
        barberProfile.setDescription(request.getDescription());
        barberProfile.setRating(BigDecimal.valueOf(5.0));
        barberProfile.setIsActive(true);

        System.out.println("DEBUG - Before save, barberProfile specialties: " + barberProfile.getSpecialties());

        BarberProfile savedBarberProfile = barberProfileRepository.save(barberProfile);

        System.out.println("DEBUG - After save, savedBarberProfile specialties: " + savedBarberProfile.getSpecialties());

        return convertToBarberDto(savedBarberProfile);
    }

    public BarberDto updateBarber(Long barberId, CreateBarberRequestDto request) {
        BarberProfile barberProfile = barberProfileRepository.findById(barberId)
            .orElseThrow(() -> new RuntimeException("Barber not found with id: " + barberId));

        User user = barberProfile.getUser();

        // Verificar que el email no esté en uso por otro usuario
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        // Actualizar datos del usuario
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Actualizar datos del perfil de barbero
        barberProfile.setExperience(request.getExperience());
        barberProfile.setSpecialties(request.getSpecialties());
        barberProfile.setDescription(request.getDescription());

        // Guardar cambios
        userRepository.save(user);
        BarberProfile savedBarberProfile = barberProfileRepository.save(barberProfile);

        return convertToBarberDto(savedBarberProfile);
    }

    public void deactivateBarber(Long barberId) {
        BarberProfile barberProfile = barberProfileRepository.findById(barberId)
            .orElseThrow(() -> new RuntimeException("Barber not found with id: " + barberId));

        barberProfile.setIsActive(false);
        barberProfile.getUser().setIsActive(false);

        barberProfileRepository.save(barberProfile);
    }

    public void activateBarber(Long barberId) {
        BarberProfile barberProfile = barberProfileRepository.findById(barberId)
            .orElseThrow(() -> new RuntimeException("Barber not found with id: " + barberId));

        barberProfile.setIsActive(true);
        barberProfile.getUser().setIsActive(true);

        barberProfileRepository.save(barberProfile);
    }

    public void deleteBarber(Long barberId) {
        BarberProfile barberProfile = barberProfileRepository.findById(barberId)
            .orElseThrow(() -> new RuntimeException("Barber not found with id: " + barberId));

        User user = barberProfile.getUser();

        // Eliminar horarios del barbero
        barberScheduleRepository.deleteByBarberProfileId(barberId);

        // Eliminar perfil de barbero
        barberProfileRepository.delete(barberProfile);

        // Eliminar usuario
        userRepository.delete(user);
    }

    public List<BarberDto> getBarbersBySpecialty(String specialty) {
        return barberProfileRepository.findBySpecialty(specialty).stream()
            .map(this::convertToBarberDto)
            .collect(Collectors.toList());
    }

    public long getActiveBarberCount() {
        return barberProfileRepository.countActiveBarbers();
    }

    private BarberDto convertToBarberDto(BarberProfile barberProfile) {
        User user = barberProfile.getUser();

        BarberDto barberDto = new BarberDto();
        barberDto.setId(barberProfile.getId());
        barberDto.setUserId(user.getId()); // ID del usuario para crear citas
        barberDto.setName(user.getName());
        barberDto.setEmail(user.getEmail());
        barberDto.setPhone(user.getPhone());
        barberDto.setAvatar(user.getAvatar());
        barberDto.setSpecialties(barberProfile.getSpecialties());
        barberDto.setRating(barberProfile.getRating());
        barberDto.setExperience(barberProfile.getExperience());
        barberDto.setDescription(barberProfile.getDescription());
        barberDto.setIsActive(barberProfile.getIsActive());

        // Cargar horarios si existen
        List<BarberSchedule> schedules = barberScheduleRepository.findByBarberProfileIdOrderByDayOfWeekAscStartTimeAsc(barberProfile.getId());
        List<BarberScheduleDto> scheduleDtos = schedules.stream()
            .map(this::convertToBarberScheduleDto)
            .collect(Collectors.toList());
        barberDto.setSchedule(scheduleDtos);

        return barberDto;
    }

    private BarberScheduleDto convertToBarberScheduleDto(BarberSchedule schedule) {
        BarberScheduleDto dto = new BarberScheduleDto();
        dto.setId(schedule.getId());
        dto.setDayOfWeek(schedule.getDayOfWeek());
        dto.setStartTime(schedule.getStartTime());
        dto.setEndTime(schedule.getEndTime());
        dto.setIsAvailable(schedule.getIsAvailable());
        return dto;
    }

    private String generateAvatarUrl(String name) {
        return "https://api.dicebear.com/7.x/avataaars/svg?seed=" + name.replace(" ", "");
    }
}