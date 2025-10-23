-- Datos iniciales para testing
-- NOTA: Las contraseñas están hasheadas con BCrypt (password: "password123")

-- Limpiar servicios duplicados (mantener solo el primero de cada nombre)
DELETE FROM services
WHERE id NOT IN (
    SELECT MIN(id)
    FROM services
    GROUP BY name
);

-- Insertar roles primero (usando ON CONFLICT para evitar duplicados)
INSERT INTO roles (name, description, is_active, created_at, updated_at) VALUES
('ADMIN', 'Administrador del sistema con acceso completo', true, NOW(), NOW()),
('BARBER', 'Barbero que puede gestionar sus citas y perfil', true, NOW(), NOW()),
('CLIENT', 'Cliente que puede reservar citas y ver su historial', true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Insertar usuarios (con UPDATE en caso de conflicto para asegurar roles correctos)
INSERT INTO users (name, email, password, phone, role_id, avatar, is_active, created_at, updated_at) VALUES
-- Admin (role_id = 1)
('Admin User', 'admin@barbershop.com', '$2a$10$seCJCqfVr8F3ecyhAUaVLOPH1zxhheX9OmAHvDsxCYI/jFbC/tTRa', '+503 7000-0001', 1, 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser', true, NOW(), NOW()),

-- Barberos (role_id = 2)
('Miguel García', 'miguel@barbershop.com', '$2a$10$seCJCqfVr8F3ecyhAUaVLOPH1zxhheX9OmAHvDsxCYI/jFbC/tTRa', '+503 7000-0002', 2, 'https://api.dicebear.com/7.x/avataaars/svg?seed=MiguelGarcia', true, NOW(), NOW()),
('Carlos López', 'carlos@barbershop.com', '$2a$10$seCJCqfVr8F3ecyhAUaVLOPH1zxhheX9OmAHvDsxCYI/jFbC/tTRa', '+503 7000-0003', 2, 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosLopez', true, NOW(), NOW()),
('Roberto Martínez', 'roberto@barbershop.com', '$2a$10$seCJCqfVr8F3ecyhAUaVLOPH1zxhheX9OmAHvDsxCYI/jFbC/tTRa', '+503 7000-0004', 2, 'https://api.dicebear.com/7.x/avataaars/svg?seed=RobertoMartinez', true, NOW(), NOW()),

-- Clientes (role_id = 3)
('Juan Pérez', 'juan@email.com', '$2a$10$seCJCqfVr8F3ecyhAUaVLOPH1zxhheX9OmAHvDsxCYI/jFbC/tTRa', '+503 7000-0005', 3, 'https://api.dicebear.com/7.x/avataaars/svg?seed=JuanPerez', true, NOW(), NOW()),
('Ana Rodríguez', 'ana@email.com', '$2a$10$seCJCqfVr8F3ecyhAUaVLOPH1zxhheX9OmAHvDsxCYI/jFbC/tTRa', '+503 7000-0006', 3, 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnaRodriguez', true, NOW(), NOW()),
('Pedro Hernández', 'pedro@email.com', '$2a$10$seCJCqfVr8F3ecyhAUaVLOPH1zxhheX9OmAHvDsxCYI/jFbC/tTRa', '+503 7000-0007', 3, 'https://api.dicebear.com/7.x/avataaars/svg?seed=PedroHernandez', true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    role_id = EXCLUDED.role_id,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    avatar = EXCLUDED.avatar,
    updated_at = NOW();

-- Limpiar especialidades y horarios duplicados antes de insertar
DELETE FROM barber_specialties;
DELETE FROM barber_schedules;

-- Insertar perfiles de barberos
INSERT INTO barber_profiles (user_id, rating, experience, description, is_active, created_at, updated_at) VALUES
(2, 4.8, 8, 'Especialista en cortes clásicos y modernos. Más de 8 años de experiencia creando looks únicos para cada cliente.', true, NOW(), NOW()),
(3, 4.9, 12, 'Maestro barbero con especialización en barbas y bigotes. Técnicas tradicionales con un toque moderno.', true, NOW(), NOW()),
(4, 4.7, 5, 'Experto en cortes fade y estilos urbanos. Siempre al día con las últimas tendencias.', true, NOW(), NOW())
ON CONFLICT (user_id) DO UPDATE SET
    rating = EXCLUDED.rating,
    experience = EXCLUDED.experience,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Insertar especialidades de barberos
INSERT INTO barber_specialties (barber_profile_id, specialty) VALUES
(1, 'Corte Clásico'),
(1, 'Corte Moderno'),
(1, 'Arreglo de Barba'),
(2, 'Barbas Tradicionales'),
(2, 'Bigotes'),
(2, 'Corte + Barba'),
(2, 'Afeitado Clásico'),
(3, 'Fade'),
(3, 'Undercut'),
(3, 'Cortes Urbanos'),
(3, 'Diseños en Cabello');

-- Insertar horarios de barberos (Lunes a Sábado, 8:00 AM - 6:00 PM)
INSERT INTO barber_schedules (barber_profile_id, day_of_week, start_time, end_time, is_available) VALUES
-- Miguel García (Lunes a Sábado)
(1, 1, '08:00:00', '18:00:00', true),
(1, 2, '08:00:00', '18:00:00', true),
(1, 3, '08:00:00', '18:00:00', true),
(1, 4, '08:00:00', '18:00:00', true),
(1, 5, '08:00:00', '18:00:00', true),
(1, 6, '08:00:00', '16:00:00', true),

-- Carlos López (Martes a Domingo)
(2, 2, '09:00:00', '19:00:00', true),
(2, 3, '09:00:00', '19:00:00', true),
(2, 4, '09:00:00', '19:00:00', true),
(2, 5, '09:00:00', '19:00:00', true),
(2, 6, '09:00:00', '17:00:00', true),
(2, 0, '10:00:00', '15:00:00', true),

-- Roberto Martínez (Lunes a Viernes)
(3, 1, '07:30:00', '17:30:00', true),
(3, 2, '07:30:00', '17:30:00', true),
(3, 3, '07:30:00', '17:30:00', true),
(3, 4, '07:30:00', '17:30:00', true),
(3, 5, '07:30:00', '17:30:00', true);

-- Insertar servicios
INSERT INTO services (name, description, price, duration, image, category, is_active, created_at, updated_at) VALUES
('Corte Clásico', 'Corte de cabello tradicional con tijera y navaja. Incluye lavado y peinado.', 15.00, 45, '/assets/images/services/default.svg', 'HAIRCUT', true, NOW(), NOW()),
('Corte Moderno', 'Cortes actuales y tendencias. Fade, undercut, y estilos contemporáneos.', 18.00, 50, '/assets/images/services/default.svg', 'HAIRCUT', true, NOW(), NOW()),
('Arreglo de Barba', 'Recorte, perfilado y arreglo de barba. Incluye aceites aromáticos.', 12.00, 30, '/assets/images/services/default.svg', 'BEARD', true, NOW(), NOW()),
('Corte + Barba', 'Servicio completo: corte de cabello + arreglo de barba.', 25.00, 75, '/assets/images/services/default.svg', 'HAIRCUT', true, NOW(), NOW()),
('Afeitado Clásico', 'Afeitado tradicional con navaja, toallas calientes y aceites.', 20.00, 40, '/assets/images/services/default.svg', 'BEARD', true, NOW(), NOW()),
('Peinado y Styling', 'Peinado profesional para eventos especiales.', 10.00, 20, '/assets/images/services/default.svg', 'STYLING', true, NOW(), NOW()),
('Tratamiento Capilar', 'Tratamiento hidratante y fortalecedor para el cabello.', 30.00, 60, '/assets/images/services/default.svg', 'TREATMENT', true, NOW(), NOW()),
('Corte Niños', 'Corte especial para niños hasta 12 años.', 12.00, 30, '/assets/images/services/default.svg', 'HAIRCUT', true, NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    duration = EXCLUDED.duration,
    image = EXCLUDED.image,
    category = EXCLUDED.category,
    updated_at = NOW();

-- Insertar algunas citas de ejemplo
INSERT INTO appointments (client_id, barber_id, service_id, date, time, status, notes, total_price, created_at, updated_at) VALUES
-- Citas confirmadas
(5, 2, 1, CURRENT_DATE + INTERVAL '1' DAY, '10:00:00', 'CONFIRMED', 'Cliente frecuente, prefiere corte corto', 15.00, NOW(), NOW()),
(6, 3, 4, CURRENT_DATE + INTERVAL '1' DAY, '14:30:00', 'CONFIRMED', 'Primera vez, corte + barba completo', 25.00, NOW(), NOW()),
(7, 2, 2, CURRENT_DATE + INTERVAL '2' DAY, '11:00:00', 'PENDING', 'Corte fade moderno', 18.00, NOW(), NOW()),

-- Citas del día actual
(5, 3, 3, CURRENT_DATE, '09:00:00', 'COMPLETED', 'Arreglo de barba regular', 12.00, NOW(), NOW()),
(6, 2, 1, CURRENT_DATE, '15:00:00', 'CONFIRMED', '', 15.00, NOW(), NOW()),

-- Citas pasadas (completadas)
(7, 2, 4, CURRENT_DATE - INTERVAL '1' DAY, '16:00:00', 'COMPLETED', 'Muy satisfecho con el servicio', 25.00, NOW(), NOW()),
(5, 3, 2, CURRENT_DATE - INTERVAL '3' DAY, '10:30:00', 'COMPLETED', '', 18.00, NOW(), NOW()),
(6, 2, 5, CURRENT_DATE - INTERVAL '5' DAY, '13:00:00', 'COMPLETED', 'Afeitado perfecto', 20.00, NOW(), NOW());

-- Update existing records with via.placeholder.com URLs to use local assets
UPDATE services SET image = '/assets/images/services/default.svg' WHERE image LIKE '%via.placeholder.com%';