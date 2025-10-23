package com.barbershop.repository;

import com.barbershop.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);

    List<Role> findByIsActiveTrueOrderByName();

    boolean existsByName(String name);

    @Query("SELECT r FROM Role r WHERE r.isActive = true AND r.name = :name")
    Optional<Role> findActiveRoleByName(@Param("name") String name);

    @Query("SELECT COUNT(r) FROM Role r WHERE r.isActive = true")
    long countActiveRoles();
}