-- Script para crear la base de datos y configurar PostgreSQL
-- Ejecutar como usuario postgres

-- 1. Crear la base de datos
CREATE DATABASE barbershop_db;

-- 2. Crear usuario (opcional, puede usar postgres)
-- CREATE USER barbershop_user WITH PASSWORD 'barbershop123';

-- 3. Otorgar permisos
-- GRANT ALL PRIVILEGES ON DATABASE barbershop_db TO barbershop_user;

-- 4. Conectar a la base de datos
\c barbershop_db;

-- Las tablas se crearán automáticamente cuando ejecutes Spring Boot
-- debido a la configuración: spring.jpa.hibernate.ddl-auto: update

-- ESTRUCTURA DE TABLAS QUE SE CREARÁN:
-- ===========================================

-- 1. TABLA ROLES (principal)
-- roles (id, name, description, is_active, created_at, updated_at)

-- 2. TABLA USUARIOS (con FK a roles)
-- users (id, name, email, password, phone, role_id, avatar, is_active, created_at, updated_at)

-- 3. TABLA PERFILES DE BARBEROS
-- barber_profiles (id, user_id, rating, experience, description, is_active, created_at, updated_at)

-- 4. TABLA ESPECIALIDADES DE BARBEROS
-- barber_specialties (barber_profile_id, specialty)

-- 5. TABLA HORARIOS DE BARBEROS
-- barber_schedules (id, barber_profile_id, day_of_week, start_time, end_time, is_available)

-- 6. TABLA SERVICIOS
-- services (id, name, description, price, duration, image, category, is_active, created_at, updated_at)

-- 7. TABLA CITAS
-- appointments (id, client_id, barber_id, service_id, date, time, status, notes, total_price, created_at, updated_at)