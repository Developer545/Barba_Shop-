# 🚀 EJECUTAR BACKEND DESDE VS CODE

## ✅ **PASO 1: Abrir en VS Code**
1. Abre **VS Code**
2. **File > Open Folder**
3. Selecciona la carpeta `backend`

## ✅ **PASO 2: Instalar extensiones (automático)**
VS Code te sugerirá instalar las extensiones necesarias automáticamente.
Si no, instala: **"Extension Pack for Java"**

## ✅ **PASO 3: Ejecutar la aplicación**

### **Método A - Más simple:**
1. Abre el archivo: `src/main/java/com/barbershop/BarberShopApplication.java`
2. Verás un botón **"Run"** arriba del método `main`
3. **Click en "Run"**

### **Método B - Desde menú Run:**
1. Presiona **F5** o **Ctrl+F5**
2. Selecciona **"🚀 Run BarberShop Backend"**

### **Método C - Desde Command Palette:**
1. **Ctrl+Shift+P**
2. Escribe **"Tasks: Run Task"**
3. Selecciona **"🚀 Spring Boot: Run"**

## 🎯 **Lo que verás:**

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2025-09-27 18:xx:xx.xxx  INFO --- [  main] c.b.BarberShopApplication : Starting BarberShopApplication
...
2025-09-27 18:xx:xx.xxx  INFO --- [  main] c.b.BarberShopApplication : Started BarberShopApplication in X.XXX seconds (JVM running for X.XXX)
```

## ✅ **VERIFICAR QUE FUNCIONA:**

### 🌐 URLs de prueba:
- **API Base**: http://localhost:8080/api
- **Servicios**: http://localhost:8080/api/public/services
- **Barberos**: http://localhost:8080/api/public/barbers

### 🔐 Login de prueba:
```json
POST http://localhost:8080/api/auth/login
{
  "email": "admin@barbershop.com",
  "password": "password123"
}
```

## 🗄️ **Tablas creadas automáticamente:**
- ✅ `roles` (ADMIN, BARBER, CLIENT)
- ✅ `users` (usuarios con roles)
- ✅ `barber_profiles` (perfiles de barberos)
- ✅ `barber_specialties` (especialidades)
- ✅ `barber_schedules` (horarios)
- ✅ `services` (servicios de barbería)
- ✅ `appointments` (citas)

## 🎉 **¡LISTO!**
Tu backend estará corriendo en el puerto 8080 y conectado a PostgreSQL.
Todas las tablas y datos de prueba se crean automáticamente.