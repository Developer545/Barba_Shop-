package com.barbershop.repository;

import com.barbershop.entity.Role;
import com.barbershop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleAndIsActiveTrue(Role role);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.isActive = true")
    List<User> findActiveUsersByRole(@Param("role") Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") Role role);

    @Query("SELECT u FROM User u WHERE u.name LIKE %:name% AND u.isActive = true")
    List<User> findByNameContainingIgnoreCaseAndIsActiveTrue(@Param("name") String name);

    @Query("SELECT u FROM User u WHERE u.role.name = :roleName AND u.isActive = true")
    List<User> findActiveUsersByRoleName(@Param("roleName") String roleName);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role.name = :roleName")
    long countByRoleName(@Param("roleName") String roleName);
}