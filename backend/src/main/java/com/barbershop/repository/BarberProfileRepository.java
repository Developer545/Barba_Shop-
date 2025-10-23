package com.barbershop.repository;

import com.barbershop.entity.BarberProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BarberProfileRepository extends JpaRepository<BarberProfile, Long> {

    Optional<BarberProfile> findByUserId(Long userId);

    List<BarberProfile> findByIsActiveTrueOrderByRatingDesc();

    @Query("SELECT bp FROM BarberProfile bp WHERE bp.isActive = true AND bp.rating >= :minRating")
    List<BarberProfile> findByMinRating(@Param("minRating") BigDecimal minRating);

    @Query("SELECT bp FROM BarberProfile bp WHERE bp.isActive = true AND :specialty MEMBER OF bp.specialties")
    List<BarberProfile> findBySpecialty(@Param("specialty") String specialty);

    @Query("SELECT bp FROM BarberProfile bp WHERE bp.isActive = true AND bp.experience >= :minExperience")
    List<BarberProfile> findByMinExperience(@Param("minExperience") Integer minExperience);

    @Query("SELECT COUNT(bp) FROM BarberProfile bp WHERE bp.isActive = true")
    long countActiveBarbers();
}