# BarberShop Backend API

Backend desarrollado en Spring Boot para el sistema de gestión de citas de barbería.

## 🚀 Tecnologías

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security con JWT**
- **Spring Data JPA**
- **PostgreSQL 17**
- **Maven**

## 📋 Prerrequisitos

- Java 17 o superior
- Maven 3.6+
- PostgreSQL 17
- IDE (recomendado: IntelliJ IDEA o VS Code)

## 🔧 Configuración de Base de Datos

1. **Instalar PostgreSQL 17**
2. **Crear la base de datos:**
   ```sql
   CREATE DATABASE barbershop_db;
   CREATE USER postgres WITH PASSWORD 'postgres';
   GRANT ALL PRIVILEGES ON DATABASE barbershop_db TO postgres;
   ```

3. **Configurar credenciales en `application.yml`:**
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/barbershop_db
       username: postgres
       password: postgres
   ```

## 🏃‍♂️ Ejecutar el Proyecto

### Método 1: Con Maven
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Método 2: Con IDE
1. Importar el proyecto como proyecto Maven
2. Ejecutar la clase `BarberShopApplication.java`

### Método 3: Con JAR
```bash
cd backend
mvn clean package
java -jar target/barbershop-backend-0.0.1-SNAPSHOT.jar
```

## 🌐 API Endpoints

El servidor se ejecuta en: `http://localhost:8080/api`

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario

### Endpoints Públicos
- `GET /public/barbers` - Obtener barberos activos
- `GET /public/services` - Obtener servicios activos

### Admin (requiere rol ADMIN)
- `GET /admin/dashboard/stats` - Estadísticas del dashboard
- `POST /admin/barbers` - Crear barbero
- `POST /admin/services` - Crear servicio
- `GET /admin/appointments` - Ver todas las citas

### Cliente (requiere rol CLIENT)
- `GET /client/appointments` - Mis citas
- `POST /client/appointments` - Crear cita

### Barbero (requiere rol BARBER)
- `GET /barber/appointments` - Mis citas como barbero
- `PUT /barber/appointments/{id}/confirm` - Confirmar cita

## 👤 Usuarios de Prueba

El sistema incluye datos iniciales para testing:

### Administrador
- **Email:** admin@barbershop.com
- **Password:** password123

### Barberos
- **Email:** miguel@barbershop.com
- **Password:** password123

- **Email:** carlos@barbershop.com
- **Password:** password123

### Clientes
- **Email:** juan@email.com
- **Password:** password123

## 🔒 Autenticación

El sistema usa JWT para autenticación. Incluye el token en el header:
```
Authorization: Bearer {token}
```

## 📊 Base de Datos

Las tablas se crean automáticamente al ejecutar la aplicación (`ddl-auto: update`).
Los datos iniciales se cargan desde `src/main/resources/data.sql`.

## 🏗️ Estructura del Proyecto

```
src/main/java/com/barbershop/
├── config/          # Configuraciones (Security, JWT)
├── controller/      # Controladores REST
├── dto/            # Data Transfer Objects
├── entity/         # Entidades JPA
├── repository/     # Repositorios
├── service/        # Lógica de negocio
├── exception/      # Manejo de excepciones
└── BarberShopApplication.java
```

## 🔧 Variables de Entorno

Puedes configurar las siguientes variables:

```yaml
# JWT
jwt:
  secret: mySecretKey123456789012345678901234567890
  expiration: 86400000

# CORS
cors:
  allowed-origins: http://localhost:4200
```

## 📝 Notas Importantes

1. **Contraseñas:** Todas las contraseñas de prueba son "password123"
2. **CORS:** Configurado para permitir peticiones desde http://localhost:4200
3. **Base de datos:** Se usa `update` para DDL, cambia a `create-drop` si necesitas recrear las tablas
4. **Logs:** Habilitados en nivel DEBUG para desarrollo

## 🐛 Troubleshooting

### Error de conexión a base de datos
- Verificar que PostgreSQL esté ejecutándose
- Confirmar credenciales en `application.yml`
- Verificar que la base de datos `barbershop_db` exista

### Error de JWT
- Verificar que el secreto JWT tenga al menos 32 caracteres
- Comprobar que el token no haya expirado

### Error de CORS
- Verificar la configuración en `SecurityConfig`
- Asegurar que el frontend esté ejecutándose en puerto 4200

## 📞 Soporte

Para problemas o dudas, revisar los logs de la aplicación que muestran información detallada de errores.