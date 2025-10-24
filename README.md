# BarberShop SaaS - Sistema de Gestión de Barbería

Aplicación full-stack para gestionar citas, barberos y servicios de una barbería.

## 🎯 Características Principales

- ✅ Autenticación segura con JWT + Refresh Tokens + Token Blacklist
- ✅ Sistema de roles (Admin, Barber, Client)
- ✅ Gestión completa de citas con calendario
- ✅ Integración con Cloudinary para imágenes
- ✅ Base de datos PostgreSQL en Neon
- ✅ Dockerizado para desarrollo local
- ✅ API REST completa con Spring Boot
- ✅ Frontend moderno con Angular 17

## 🚀 Inicio Rápido (Con Docker)

```bash
# 1. Clonar repositorio
git clone https://github.com/Developer545/Barba_Shop-.git
cd Barba_Shop-

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de Neon

# 3. Iniciar con Docker
docker-compose up --build
```

**Acceder a:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080

## 🔑 Credenciales de Prueba

```
Admin:   admin@barbershop.com / password123
Barber:  miguel@barbershop.com / password123
Client:  juan@email.com / password123
```

## 📁 Estructura

```
├── backend/               # Spring Boot API
├── frontend/              # Angular SPA
├── docker-compose.yml     # Orquestación de servicios
├── Dockerfile             # Build del backend
├── DOCKER_SETUP.md        # Guía detallada de Docker
├── .env.example           # Template de variables
└── README.md              # Este archivo
```

## 📚 Stack Tecnológico

- Backend: Java 17 + Spring Boot 3.2 + JPA
- Frontend: Angular 17 + Tailwind CSS
- Database: PostgreSQL (Neon)
- DevOps: Docker + Docker Compose

## 🔐 Seguridad

- ✅ Passwords hasheadas con BCrypt
- ✅ JWT tokens (15 minutos)
- ✅ Refresh tokens (7 días)
- ✅ Token blacklist en logout
- ✅ Spring Security con roles
- ✅ CORS configurado

## 🐳 Comandos Docker

```bash
# Iniciar
docker-compose up

# Iniciar en background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Limpiar todo
docker-compose down -v
```

## 📖 Documentación Completa

Ver [DOCKER_SETUP.md](./DOCKER_SETUP.md) para:
- Instalación detallada de Docker
- Configuración de variables
- Troubleshooting
- Comandos útiles
- Estructura de la BD

## 🚀 Deployment (Render)

El proyecto está configurado para deployar a Render automáticamente.

Variables de entorno necesarias en Render:
- DATABASE_URL (Neon)
- JWT_SECRET
- CLOUDINARY_* (opcional)

## 📝 Cambios Recientes

### v1.3.0 - Seguridad & Docker
- Refresh Tokens implementados
- Token Blacklist para logout seguro
- Auto-refresh de tokens en frontend
- HTTP Interceptor para manejo de 401
- Docker Compose para desarrollo local
- Limpieza de repositorio (705MB → 385MB)

## 🐛 Problemas Comunes

**"Connection refused" a BD:**
```bash
# Verificar .env
cat .env | grep DATABASE_URL
# Verificar Neon activo en https://console.neon.tech
```

**Puerto en uso:**
- Cambiar puerto en docker-compose.yml
- O parar otros servicios

## 📝 Requisitos

- Docker Desktop instalado
- Variables de entorno (.env)
- Acceso a BD Neon

## 👨‍💻 Autor

Daniel Castillo
Proyecto Final - Bases de Datos

---

**Para guía completa ver:** [DOCKER_SETUP.md](./DOCKER_SETUP.md)
