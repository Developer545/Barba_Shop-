package com.barbershop.repository;

import com.barbershop.entity.BarberException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BarberExceptionRepository extends JpaRepository<BarberException, Long> {

    List<BarberException> findByBarberProfileIdOrderByExceptionDateAsc(Long barberProfileId);

    List<BarberException> findByBarberProfileIdAndExceptionDate(Long barberProfileId, LocalDate exceptionDate);

    @Query("SELECT e FROM BarberException e WHERE e.barberProfile.id = :barberProfileId " +
           "AND e.exceptionDate BETWEEN :startDate AND :endDate " +
           "ORDER BY e.exceptionDate ASC")
    List<BarberException> findByBarberProfileIdAndDateRange(
        @Param("barberProfileId") Long barberProfileId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    void deleteByBarberProfileId(Long barberProfileId);
}
