# 🔒 ROUTE GUARDS - Sistema de Citas Barbería

## ¿Qué es un Route Guard?

Un **Route Guard** (Guardián de Ruta) es un mecanismo de Angular que **protege el acceso a rutas específicas** de tu aplicación. Funciona como un "guardia" que verifica si el usuario tiene permiso para acceder a una página antes de permitirle entrar.

### Analogía del mundo real:
```
Ruta protegida = Acceso a una sala VIP
Route Guard = Un guardia en la puerta que verifica tu credencial
         ↓
         Tiene credencial válida → Acceso permitido ✅
         NO tiene credencial → Acceso denegado ❌
```

---

## 📁 Archivos Principales

### 1. **auth.guard.ts**
- Verifica si el usuario **está autenticado** (tiene sesión activa)
- Usa: `authGuardFn`
- Ejemplo: Solo usuarios logueados pueden acceder

### 2. **role.guard.ts**
- Verifica si el usuario **tiene el rol requerido**
- Usa: `adminGuard`, `barberGuard`, `clientGuard`
- Ejemplo: Solo ADMINs pueden acceder al dashboard administrativo

### 3. **app.routes.ts**
- Configuración de todas las rutas con sus guards
- Define qué guard protege cada ruta

---

## 🛡️ Guards Disponibles

### A. `authGuardFn` (Guard de Autenticación)
**¿Para qué sirve?** Verifica que el usuario esté logueado.

**Cuándo usarlo:** Cuando quieres que CUALQUIER usuario autenticado acceda, independientemente de su rol.

```typescript
{
  path: 'alguna-ruta',
  component: AlgunComponente,
  canActivate: [authGuardFn]
}
```

### B. `adminGuard` (Guard de Administrador)
**¿Para qué sirve?** Solo ADMINs pueden acceder.

**Cuándo usarlo:** Funciones administrativas, configuración del sistema.

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [adminGuard]
}
```

### C. `barberGuard` (Guard de Barbero)
**¿Para qué sirve?** BARBERs y ADMINs pueden acceder.

**Cuándo usarlo:** Funciones relacionadas con barberos (gestión de citas, horarios, etc).

```typescript
{
  path: 'barber-dashboard',
  component: BarberDashboardComponent,
  canActivate: [barberGuard]
}
```

### D. `clientGuard` (Guard de Cliente)
**¿Para qué sirve?** CLIENTs y ADMINs pueden acceder.

**Cuándo usarlo:** Funciones para clientes (reservar citas, historial, etc).

```typescript
{
  path: 'client-dashboard',
  component: ClientDashboardComponent,
  canActivate: [clientGuard]
}
```

### E. `roleGuard` (Guard Genérico de Roles)
**¿Para qué sirve?** Verifica múltiples roles de forma flexible.

**Cuándo usarlo:** Cuando necesitas control granular sobre qué roles acceden.

```typescript
{
  path: 'some-route',
  component: SomeComponent,
  canActivate: [roleGuard],
  data: { roles: ['ADMIN', 'BARBER'] }  // ADMIN o BARBER pueden acceder
}
```

---

## 🔄 Flujo de Ejecución

### Cuando un usuario intenta acceder a una ruta protegida:

```
1. Usuario escribe URL en el navegador
   ↓ (ej: http://localhost:4200/dashboard)
2. Angular activa la ruta
   ↓
3. Guard verifica los permisos
   ↓
4. ¿Tiene permisos? ──→ SI ──→ Permite acceso a la página ✅
   ↓
   NO
   ↓
5. Redirige a /login ❌
   ↓
6. Usuario vuelve a la página de login
```

---

## 📊 Comparación de Guards

| Guard | Verifica | Quién Accede |
|-------|----------|-------------|
| `authGuardFn` | Autenticación | Cualquier usuario logueado |
| `adminGuard` | Rol ADMIN | Solo ADMINs |
| `barberGuard` | Rol BARBER | BARBERs y ADMINs |
| `clientGuard` | Rol CLIENT | CLIENTs y ADMINs |
| `roleGuard` | Roles dinámicos | Según configuración |

---

## 🧪 Ejemplos Prácticos

### Ejemplo 1: Ruta solo para Administrador

**Archivo:** `app.routes.ts`

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [adminGuard]  // ← Guard protege la ruta
}
```

**Prueba:**
- ✅ Logueate como ADMIN → Accedes a /dashboard
- ❌ Logueate como BARBER → Redirige a /login
- ❌ Logueate como CLIENT → Redirige a /login

### Ejemplo 2: Ruta para Barbero (y Admin)

```typescript
{
  path: 'barber-dashboard',
  component: BarberDashboardComponent,
  canActivate: [barberGuard]  // ← Guard permite BARBER y ADMIN
}
```

**Prueba:**
- ✅ Logueate como BARBER → Accedes a /barber-dashboard
- ✅ Logueate como ADMIN → Accedes a /barber-dashboard (admin accede a todo)
- ❌ Logueate como CLIENT → Redirige a /login

### Ejemplo 3: Ruta para Cliente (y Admin)

```typescript
{
  path: 'client-dashboard',
  component: ClientDashboardComponent,
  canActivate: [clientGuard]  // ← Guard permite CLIENT y ADMIN
}
```

---

## ⚙️ Cómo Agregar una Nueva Ruta Protegida

Si necesitas proteger una nueva ruta, sigue estos pasos:

### Paso 1: Define la ruta en `app.routes.ts`

```typescript
{
  path: 'mi-nueva-ruta',
  component: MiNuevoComponente,
  canActivate: [adminGuard]  // Elige el guard apropiado
}
```

### Paso 2: Importa el guard

```typescript
import { adminGuard } from './guards/role.guard';
```

### Paso 3: Prueba

```bash
# 1. Logueate como el rol correcto
# 2. Intenta acceder a la ruta
# 3. Verifica que sea redirigido si no tiene permisos
```

---

## 🚀 Consideraciones para Producción

Cuando despliegues a **Render** con base de datos en **Neon**:

### 1. Token JWT válido
```typescript
// El token se obtiene del backend en Render
// AuthService lo almacena en localStorage
localStorage.getItem('token')
```

### 2. Validación en Backend
```
Frontend Guard (verifica rápido)
           ↓
Backend Validation (verifica de verdad)
           ↓
Solo si ambos OK → Acceso permitido
```

### 3. Session Persistence
```typescript
// Al recargar la página, el usuario se mantiene logueado
// porque el token está guardado en localStorage
```

---

## 🐛 Debugging / Solución de Problemas

### Problema: Siempre redirige a /login

**Solución:**
```typescript
// Verifica que:
1. localStorage tenga el 'currentUser'
2. El usuario esté correctamente logueado
3. El rol sea el correcto

// Agrega logs en role.guard.ts:
console.log('Usuario actual:', authService.getCurrentUser());
```

### Problema: Guard no está funcionando

**Solución:**
```typescript
// Verifica que:
1. El guard esté importado en app.routes.ts
2. El guard esté en canActivate: [guardName]
3. No haya errores de TypeScript
```

---

## 📚 Estructura de Código Recomendada

```
src/app/
├── guards/
│   ├── auth.guard.ts         ← Guard de autenticación
│   ├── role.guard.ts         ← Guards de roles
│   └── GUARDS-README.md      ← Este archivo
├── app.routes.ts            ← Configuración de rutas
└── services/
    └── auth.service.ts      ← Servicio de autenticación
```

---

## 💡 Mejores Prácticas

1. **Siempre protege las rutas en el backend también**
   - Los guards de Angular son para UX
   - El verdadero control está en el backend

2. **Usa Guards específicos cuando sea posible**
   - `adminGuard` es más legible que `roleGuard` con data
   - Menos código = menos errores

3. **Mantén comentarios explicativos**
   - Facilita el entendimiento para otros desarrolladores
   - Especialmente importante en proyectos educativos

4. **Prueba con diferentes roles**
   - Asegúrate de que cada rol acceda a lo correcto
   - Verifica que los no autorizados sean redirigidos

---

## 🎓 Para Estudiantes

Este código está diseñado para ser educativo. Aquí aprenderás:

✅ Cómo proteger rutas en Angular
✅ Uso de Guards funcionales (forma moderna)
✅ Separación de responsabilidades
✅ Reutilización de código
✅ Patrones de seguridad en frontend

**Recuerda:** Este es solo el primer nivel de seguridad. La verdadera protección está en el backend con Spring Security.

---

## 📖 Referencias

- [Angular Route Guards - Documentación Oficial](https://angular.io/guide/router-tutorial-toh#preventing-unauthorized-access)
- [CanActivateFn](https://angular.io/api/router/CanActivateFn)
- [Router Configuration](https://angular.io/guide/router)

---

**Versión:** 1.0
**Última actualización:** 2024
**Autor:** Sistema de Citas Barbería
