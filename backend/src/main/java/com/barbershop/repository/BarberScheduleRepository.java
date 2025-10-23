package com.barbershop.repository;

import com.barbershop.entity.BarberSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface BarberScheduleRepository extends JpaRepository<BarberSchedule, Long> {

    List<BarberSchedule> findByBarberProfileIdOrderByDayOfWeekAscStartTimeAsc(Long barberProfileId);

    List<BarberSchedule> findByBarberProfileIdAndDayOfWeek(Long barberProfileId, Integer dayOfWeek);

    void deleteByBarberProfileId(Long barberProfileId);

    @Query("SELECT bs FROM BarberSchedule bs WHERE bs.barberProfile.id = :barberProfileId AND bs.dayOfWeek = :dayOfWeek AND bs.isAvailable = true")
    List<BarberSchedule> findAvailableScheduleByBarberAndDay(@Param("barberProfileId") Long barberProfileId,
                                                            @Param("dayOfWeek") Integer dayOfWeek);

    @Query("SELECT bs FROM BarberSchedule bs WHERE bs.barberProfile.id = :barberProfileId AND bs.dayOfWeek = :dayOfWeek AND :time BETWEEN bs.startTime AND bs.endTime AND bs.isAvailable = true")
    List<BarberSchedule> findByBarberAndDayAndTimeRange(@Param("barberProfileId") Long barberProfileId,
                                                       @Param("dayOfWeek") Integer dayOfWeek,
                                                       @Param("time") LocalTime time);
}