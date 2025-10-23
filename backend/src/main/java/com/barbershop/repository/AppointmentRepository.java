package com.barbershop.repository;

import com.barbershop.entity.Appointment;
import com.barbershop.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByClientIdOrderByDateDescTimeDesc(Long clientId);

    List<Appointment> findByBarberIdOrderByDateAscTimeAsc(Long barberId);

    List<Appointment> findByDateAndBarberIdOrderByTimeAsc(LocalDate date, Long barberId);

    List<Appointment> findByDateAndTimeAndBarberId(LocalDate date, LocalTime time, Long barberId);

    List<Appointment> findByStatus(AppointmentStatus status);

    @Query("SELECT a FROM Appointment a WHERE a.date = :date ORDER BY a.time ASC")
    List<Appointment> findByDateOrderByTimeAsc(@Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.barber.id = :barberId AND a.date = :date AND a.status IN :statuses")
    List<Appointment> findByBarberAndDateAndStatusIn(@Param("barberId") Long barberId,
                                                     @Param("date") LocalDate date,
                                                     @Param("statuses") List<AppointmentStatus> statuses);

    @Query("SELECT a FROM Appointment a WHERE a.client.id = :clientId AND a.status = :status")
    List<Appointment> findByClientIdAndStatus(@Param("clientId") Long clientId, @Param("status") AppointmentStatus status);

    @Query("SELECT a FROM Appointment a WHERE a.date BETWEEN :startDate AND :endDate ORDER BY a.date ASC, a.time ASC")
    List<Appointment> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.date = :date")
    long countByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.date BETWEEN :startDate AND :endDate AND a.status = :status")
    long countByDateRangeAndStatus(@Param("startDate") LocalDate startDate,
                                   @Param("endDate") LocalDate endDate,
                                   @Param("status") AppointmentStatus status);

    @Query("SELECT SUM(a.totalPrice) FROM Appointment a WHERE a.date BETWEEN :startDate AND :endDate AND a.status = 'COMPLETED'")
    BigDecimal sumRevenueByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT a FROM Appointment a WHERE a.date >= :today AND a.status IN ('PENDING', 'CONFIRMED') ORDER BY a.date ASC, a.time ASC")
    List<Appointment> findUpcomingAppointments(@Param("today") LocalDate today);

    @Query("SELECT a FROM Appointment a WHERE a.barber.id = :barberId AND a.date >= :today AND a.status IN ('PENDING', 'CONFIRMED') ORDER BY a.date ASC, a.time ASC")
    List<Appointment> findUpcomingAppointmentsByBarber(@Param("barberId") Long barberId, @Param("today") LocalDate today);
}