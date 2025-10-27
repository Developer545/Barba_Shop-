# 🐳 Docker Setup Guide - BarberShop SaaS

Guía completa para ejecutar el proyecto localmente usando Docker.

## 📋 Requisitos Previos

- **Docker**: [Descargar e instalar Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Incluido en Docker Desktop

## 🚀 Pasos para Ejecutar Localmente

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/Developer545/Barba_Shop-.git
cd Barba_Shop-
```

### 2️⃣ Configurar Variables de Entorno

Copiar el archivo de ejemplo y completar las variables:

```bash
# Linux / macOS
cp .env.example .env

# Windows
copy .env.example .env
```

Editar `.env` con tus credenciales de Neon:

```env
# Obtener de https://console.neon.tech
DATABASE_URL=postgresql://neondb_owner:your_password@ep-winter-band-adma1cjo-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DATABASE_USERNAME=neondb_owner
DATABASE_PASSWORD=your_neon_password_here

# JWT (cambiar en producción)
JWT_SECRET=my-super-secret-key-min-32-characters-long

# Cloudinary (opcional, si usas uploads de imágenes)
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 3️⃣ Iniciar los Contenedores

```bash
# Construir e iniciar
docker-compose up --build

# O solo iniciar (si ya están construidos)
docker-compose up
```

**Acceder a la aplicación:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080
- Swagger Docs (si está configurado): http://localhost:8080/swagger-ui.html

### 4️⃣ Detener los Contenedores

```bash
# Parar sin eliminar
docker-compose down

# Parar y eliminar datos
docker-compose down -v
```

## 🔍 Verificar que Todo Funciona

### Verificar Contenedores

```bash
# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Verificar Conectividad Backend

```bash
# Dentro del contenedor backend
docker-compose exec backend sh

# O desde tu máquina
curl http://localhost:8080/public/barbers
```

## 📝 Credenciales de Prueba

**Admin:**
- Email: `admin@barbershop.com`
- Password: `password123`

**Barber:**
- Email: `miguel@barbershop.com`
- Password: `password123`

**Client:**
- Email: `juan@email.com`
- Password: `password123`

## 🗄️ Base de Datos

**Neon (Producción y Desarrollo):**
- Misma instancia compartida
- URL: Configurada en `.env`
- Migrations: Se ejecutan automáticamente con JPA/Hibernate

## 🐛 Troubleshooting

### "Connection refused" a la base de datos

```bash
# Verificar que DATABASE_URL sea correcto en .env
# El formato debe ser:
# postgresql://user:password@host:5432/database

# Verificar que Neon está activo en https://console.neon.tech
```

### Frontend no carga

```bash
# Limpiar caché de navegador
# Ctrl+Shift+Delete (Windows) o Cmd+Shift+Delete (Mac)

# O reconstruir contenedor
docker-compose build --no-cache frontend
docker-compose up
```

### Puerto ya en uso

```bash
# Si el puerto 4200 o 8080 está en uso, cambiar en docker-compose.yml:
# ports:
#   - "8080:8080"  <- Cambiar primer número
#   - "4200:80"    <- Cambiar primer número
```

### Ver logs detallados

```bash
docker-compose logs -f backend --tail=100
docker-compose logs -f frontend --tail=100
```

## 📦 Estructura del Proyecto

```
.
├── backend/                 # Spring Boot API
│   ├── src/
│   ├── pom.xml             # Maven configuration
│   └── Dockerfile          # Build backend image
├── frontend/               # Angular SPA
│   ├── src/
│   ├── package.json
│   ├── Dockerfile          # Build frontend image
│   └── nginx.conf          # Nginx configuration
├── docker-compose.yml      # Orquestación de servicios
├── Dockerfile              # Multi-stage for backend
├── .env.example            # Template de variables
└── .dockerignore          # Excluir archivos del build
```

## 🔐 Variables de Entorno Importantes

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| DATABASE_URL | Conexión a Neon PostgreSQL | postgresql://user:pass@host/db |
| JWT_SECRET | Clave secreta para JWT tokens | min-32-caracteres |
| CLOUDINARY_* | Credenciales Cloudinary | Para uploads de imágenes |
| CORS_ALLOWED_ORIGINS | Orígenes permitidos | http://localhost:4200 |

## 🚢 Deploying a Producción (Render)

Si deseas deployar a Render, las variables de entorno ya están configuradas.
El deploy en Render usa el Dockerfile existente.

**No cambiar:**
- Dockerfile (backend)
- docker-compose.yml (solo para desarrollo local)

## 📚 Documentación Adicional

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Spring Boot Docker](https://spring.io/guides/gs/spring-boot-docker/)
- [Angular with Docker](https://angular.io/guide/docker)

## 💡 Tips

- Usa `docker-compose up --build` solo cuando cambies dependencias
- Usa `docker-compose up` para desarrollo iterativo (cambios de código)
- Los cambios en código se reflejan cuando se reconstruyen los contenedores
- Para desarrollo más rápido, considera correr localmente sin Docker

## ❓ Preguntas?

Revisa los logs: `docker-compose logs -f`

¡Listo! 🎉
