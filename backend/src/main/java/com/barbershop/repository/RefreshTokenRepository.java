package com.barbershop.repository;

import com.barbershop.entity.RefreshToken;
import com.barbershop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUserAndIsRevokedFalse(User user);
    void deleteByExpiryDateBefore(LocalDateTime date);
    void deleteByUser(User user);
}
