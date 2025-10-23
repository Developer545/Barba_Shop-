package com.barbershop.repository;

import com.barbershop.entity.Service;
import com.barbershop.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    List<Service> findByIsActiveTrueOrderByNameAsc();

    List<Service> findByCategory(ServiceCategory category);

    List<Service> findByCategoryAndIsActiveTrue(ServiceCategory category);

    @Query("SELECT s FROM Service s WHERE s.isActive = true AND s.price BETWEEN :minPrice AND :maxPrice")
    List<Service> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);

    @Query("SELECT s FROM Service s WHERE s.isActive = true AND s.duration <= :maxDuration")
    List<Service> findByMaxDuration(@Param("maxDuration") Integer maxDuration);

    @Query("SELECT s FROM Service s WHERE s.isActive = true AND s.name LIKE %:name%")
    List<Service> findByNameContainingIgnoreCaseAndIsActiveTrue(@Param("name") String name);

    @Query("SELECT COUNT(s) FROM Service s WHERE s.isActive = true")
    long countActiveServices();
}