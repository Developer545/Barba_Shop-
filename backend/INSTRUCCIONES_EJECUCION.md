# 🚀 Instrucciones para Ejecutar el Backend

El backend está listo, pero Maven tiene problemas de conectividad SSL. Aquí tienes varias alternativas para ejecutar el proyecto:

## ✅ **Método 1: Ejecutar desde IntelliJ IDEA (RECOMENDADO)**

1. **Abrir IntelliJ IDEA**
2. **File > Open** y seleccionar la carpeta `backend`
3. **Esperar** a que IntelliJ importe el proyecto Maven automáticamente
4. **Ejecutar** la clase `BarberShopApplication.java` (click derecho > Run)

## ✅ **Método 2: Ejecutar desde VS Code**

1. **Abrir VS Code**
2. **File > Open Folder** y seleccionar la carpeta `backend`
3. **Instalar** la extensión "Extension Pack for Java" si no la tienes
4. **Abrir** `src/main/java/com/barbershop/BarberShopApplication.java`
5. **Click** en "Run" que aparece arriba del método `main`

## ✅ **Método 3: Ejecutar desde Eclipse**

1. **Abrir Eclipse**
2. **File > Import > Existing Maven Project**
3. **Seleccionar** la carpeta `backend`
4. **Click derecho** en el proyecto > Run As > Java Application
5. **Seleccionar** `BarberShopApplication`

## ✅ **Método 4: Solucionar Maven y ejecutar por comandos**

Si quieres usar comandos, necesitas configurar Maven:

### 4.1 Configurar Maven para SSL
Crear archivo `%USERPROFILE%\.m2\settings.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                              http://maven.apache.org/xsd/settings-1.0.0.xsd">
    <mirrors>
        <mirror>
            <id>central-secure</id>
            <name>Central Repository</name>
            <url>https://repo1.maven.org/maven2</url>
            <mirrorOf>central</mirrorOf>
        </mirror>
    </mirrors>
</settings>
```

### 4.2 Ejecutar con Java específico
```bash
# En el directorio backend
mvn clean spring-boot:run -Djava.version=17
```

## 🎯 **Lo que debería pasar al ejecutar:**

1. **Spring Boot se iniciará** en el puerto `8080`
2. **Se conectará** a PostgreSQL en `localhost:5432`
3. **Creará automáticamente** las siguientes tablas:
   - `roles`
   - `users`
   - `barber_profiles`
   - `barber_specialties`
   - `barber_schedules`
   - `services`
   - `appointments`

4. **Insertará datos de prueba** automáticamente

## 📋 **Verificar que funciona:**

### URL de la API: `http://localhost:8080/api`

### Probar endpoints:
- **GET** `http://localhost:8080/api/public/services` - Ver servicios
- **GET** `http://localhost:8080/api/public/barbers` - Ver barberos
- **POST** `http://localhost:8080/api/auth/login` - Login

### Usuarios de prueba:
```json
{
  "email": "admin@barbershop.com",
  "password": "password123"
}
```

## 🐛 **Si hay errores:**

### Error de conexión a DB:
- Verificar que PostgreSQL esté ejecutándose
- Verificar que la base de datos `barbershop_db` exista
- Verificar credenciales en `application.yml`

### Error de puerto ocupado:
- Cambiar puerto en `application.yml` (línea 2): `port: 8081`

### Error de dependencias:
- Ejecutar desde IDE en lugar de comandos
- El IDE descarga las dependencias automáticamente

## 🔥 **¡Después de ejecutar exitosamente!**

El backend estará corriendo y listo para conectar con el frontend Angular.
Todas las tablas y datos de prueba se habrán creado automáticamente.

**¡Tu sistema de barbería estará funcionando!** 🎉