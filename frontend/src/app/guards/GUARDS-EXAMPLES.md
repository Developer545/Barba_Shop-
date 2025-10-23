# 📋 Ejemplos Prácticos de Route Guards

Esta guía contiene ejemplos reales y paso a paso de cómo usar los Route Guards en tu aplicación.

---

## 1. Estructura Actual del Proyecto

```
frontend/src/app/
├── guards/
│   ├── auth.guard.ts          ← Verifica autenticación
│   ├── role.guard.ts          ← Verifica roles
│   ├── GUARDS-README.md       ← Documentación
│   └── GUARDS-EXAMPLES.md     ← Este archivo
├── pages/
│   ├── login.component.ts     ← Pública (sin guard)
│   ├── register.component.ts  ← Pública (sin guard)
│   ├── dashboard.component.ts ← Protegida (adminGuard)
│   ├── barber-dashboard.component.ts      ← Protegida (barberGuard)
│   └── client-dashboard.component.ts      ← Protegida (clientGuard)
├── services/
│   └── auth.service.ts        ← Servicio de autenticación
└── app.routes.ts              ← Configuración de rutas
```

---

## 2. Caso de Uso: Sistema de Citas Barbería

### Escenario:
- **Admin:** Accede a `/dashboard` para administrar todo
- **Barbero:** Accede a `/barber-dashboard` para gestionar sus citas
- **Cliente:** Accede a `/client-dashboard` para reservar citas
- **Usuario no logueado:** Es redirigido a `/login`

### Configuración Actual en `app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { adminGuard, barberGuard, clientGuard } from './guards/role.guard';

export const routes: Routes = [
  // Pública
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protegida - Solo ADMIN
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },

  // Protegida - BARBER y ADMIN
  { path: 'barber-dashboard', component: BarberDashboardComponent, canActivate: [barberGuard] },

  // Protegida - CLIENT y ADMIN
  { path: 'client-dashboard', component: ClientDashboardComponent, canActivate: [clientGuard] },

  // Redirecciones
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
```

---

## 3. Pruebas Paso a Paso

### Test 1: Usuario sin autenticación

**Objetivo:** Verificar que un usuario no logueado no pueda acceder a rutas protegidas.

**Pasos:**
```
1. Abre http://localhost:4200/dashboard (sin estar logueado)
2. ¿Qué pasa?
   ✅ Correcto: Se redirige a http://localhost:4200/login
   ❌ Incorrecto: Te muestra el contenido de dashboard
```

**Por qué funciona:**
```typescript
// En role.guard.ts
const user = authService.getCurrentUser();
// getCurrentUser() retorna null si no está logueado
// El guard verifica: if (user && user.role === ...)
// Si user es null, retorna false y redirige
```

---

### Test 2: Usuario CLIENT intentando acceder a ADMIN

**Objetivo:** Verificar que un CLIENT no pueda acceder al dashboard de ADMIN.

**Pasos:**
```
1. Logueate como CLIENT (usuario@ejemplo.com, password)
2. Intenta ir a http://localhost:4200/dashboard
3. ¿Qué pasa?
   ✅ Correcto: Se redirige a /login
   ❌ Incorrecto: Te muestra el dashboard de admin
```

**Por qué funciona:**
```typescript
// En role.guard.ts - adminGuard
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario es ADMIN
  if (authService.hasRole(UserRole.ADMIN)) {
    return true;  // ← CLIENT falla aquí
  }

  router.navigate(['/login']);
  return false;   // ← CLIENT es redirigido
};
```

---

### Test 3: Usuario BARBER accediendo a su dashboard

**Objetivo:** Verificar que un BARBER pueda acceder a su dashboard.

**Pasos:**
```
1. Logueate como BARBER (barber@barbershop.com)
2. Ve a http://localhost:4200/barber-dashboard
3. ¿Qué pasa?
   ✅ Correcto: Se muestra el dashboard de barbero
   ❌ Incorrecto: Se redirige a /login
```

**Por qué funciona:**
```typescript
// En role.guard.ts - barberGuard
export const barberGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  // BARBER o ADMIN pueden acceder
  if (user && (user.role === UserRole.BARBER || user.role === UserRole.ADMIN)) {
    return true;  // ← BARBER entra aquí y accede
  }

  router.navigate(['/login']);
  return false;
};
```

---

### Test 4: ADMIN accediendo a dashboard de BARBER

**Objetivo:** Verificar que un ADMIN puede acceder a cualquier dashboard (incluido el de BARBER).

**Pasos:**
```
1. Logueate como ADMIN (admin@barbershop.com)
2. Ve a http://localhost:4200/barber-dashboard
3. ¿Qué pasa?
   ✅ Correcto: Se muestra el dashboard de barbero (ADMIN puede acceder a todo)
   ❌ Incorrecto: Se redirige a /login
```

**Por qué funciona:**
```typescript
// barberGuard permite tanto BARBER como ADMIN
if (user && (user.role === UserRole.BARBER || user.role === UserRole.ADMIN)) {
  return true;  // ← ADMIN entra aquí porque es ADMIN
}
```

---

## 4. Flujo Visual de Autenticación y Autorización

```
┌─────────────────────────────────────────────────────────────────┐
│  Usuario intenta acceder a http://localhost:4200/dashboard      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Guard verifica permisos     │
            │  ¿Está autenticado?          │
            └──────────────┬───────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
          NO                               SI
           │                               │
           │                    ┌──────────▼─────────┐
           │                    │ ¿Tiene rol ADMIN?  │
           │                    └────────┬────────┬──┘
           │                             │        │
           │                            NO       SI
           │                             │        │
           ▼                             ▼        ▼
      ┌────────────┐              ┌────────┐  ┌────────┐
      │  Redirige  │              │Redirige│  │Permite │
      │   a login  │              │a login │  │acceso  │
      │    ❌      │              │  ❌    │  │  ✅    │
      └────────────┘              └────────┘  └────────┘
```

---

## 5. Código del Guard Explicado Línea por Línea

### Ejemplo: `adminGuard`

```typescript
// Importar lo necesario
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

// Crear el guard como función
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,    // ← Info de la ruta actual
  state: RouterStateSnapshot        // ← Estado del router
) => {
  // Inyectar servicios necesarios
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener el usuario actual desde el servicio
  // Si no está logueado, retorna null
  if (authService.hasRole(UserRole.ADMIN)) {
    console.log('✅ Usuario es ADMIN, permitiendo acceso');
    return true;  // ← Permitir acceso
  }

  // Si no es ADMIN, redirigir a login
  console.log('❌ Usuario no es ADMIN, redirigiendo a login');
  router.navigate(['/login']);
  return false;  // ← Denegar acceso
};
```

---

## 6. Integración con AuthService

El guard usa los métodos de `AuthService`:

```typescript
// auth.service.ts

// Método 1: Verificar si está autenticado
isAuthenticated(): boolean {
  return this.currentUserSubject.value !== null;
}

// Método 2: Verificar si tiene un rol específico
hasRole(role: UserRole): boolean {
  const user = this.getCurrentUser();
  return user ? user.role === role : false;
}

// Método 3: Obtener usuario actual
getCurrentUser(): User | null {
  return this.currentUserSubject.value;
}
```

El guard accede a estos métodos:

```typescript
// En role.guard.ts
const authService = inject(AuthService);

// Usa hasRole()
if (authService.hasRole(UserRole.ADMIN)) { ... }

// O usa getCurrentUser()
const user = authService.getCurrentUser();
if (user && user.role === UserRole.ADMIN) { ... }
```

---

## 7. Ciclo Completo: Desde Login hasta Dashboard

### Paso 1: Usuario abre la app
```
URL: http://localhost:4200
→ Redirige a /login (ruta raíz)
```

### Paso 2: Usuario completa el formulario de login
```
Email: admin@barbershop.com
Password: password123
```

### Paso 3: AuthService hace login
```typescript
// auth.service.ts
login(loginData: LoginData): Observable<User> {
  return this.http.post(`${this.apiUrl}/auth/login`, loginData)
    .pipe(
      map(response => {
        // Guardar token
        localStorage.setItem('token', response.token);

        // Guardar usuario
        localStorage.setItem('currentUser', JSON.stringify(response.user));

        // Notificar al componente
        this.currentUserSubject.next(response.user);

        return response.user;
      })
    );
}
```

### Paso 4: Usuario navega a /dashboard
```
router.navigate(['/dashboard'])
```

### Paso 5: Guard verifica permisos
```typescript
// adminGuard se ejecuta automáticamente
const user = authService.getCurrentUser();
// Retorna: { id: 1, name: 'Admin', email: 'admin@...', role: 'ADMIN', ... }

if (authService.hasRole(UserRole.ADMIN)) {
  return true;  // ← PERMITIR
}
```

### Paso 6: Dashboard se carga
```
✅ Usuario ve el dashboard administrativo
```

---

## 8. Casos de Error Común

### Error 1: "Cannot match any routes"

**Problema:**
```
Error: Cannot match any routes. URL Segment: 'dashboard'
```

**Causa:** La ruta no está definida en `app.routes.ts`

**Solución:**
```typescript
// Verifica que esté en app.routes.ts
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [adminGuard]
  }
];
```

---

### Error 2: Guard no funciona (siempre redirige)

**Problema:** El guard siempre redirige a login, aunque estés logueado.

**Causa:**
```typescript
// Probablemente localStorage está vacío
getCurrentUser() retorna null
```

**Solución:**
```typescript
// Verifica el flujo de login:
// 1. Backend retorna token y user
// 2. AuthService guarda en localStorage
// 3. currentUserSubject se actualiza

// Debug:
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('currentUser'));
console.log('Current user:', authService.getCurrentUser());
```

---

### Error 3: Import de guard no existe

**Problema:**
```
Error: Could not find "adminGuard"
```

**Causa:** El guard no está exportado o mal importado.

**Solución:**
```typescript
// En app.routes.ts
// Verifica la importación
import { adminGuard, barberGuard, clientGuard } from './guards/role.guard';

// Verifica que exista en role.guard.ts
export const adminGuard: CanActivateFn = ...
```

---

## 9. Testing de Guards (Para Avanzados)

### Prueba unitaria de un guard

```typescript
// admin.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { adminGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('adminGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow access if user is admin', () => {
    // Setup: Usuario es ADMIN
    spyOn(authService, 'hasRole').and.returnValue(true);

    // Ejecutar guard
    const result = adminGuard({} as any, {} as any);

    // Verificar
    expect(result).toBe(true);
  });

  it('should deny access if user is not admin', () => {
    // Setup: Usuario NO es ADMIN
    spyOn(authService, 'hasRole').and.returnValue(false);
    spyOn(router, 'navigate');

    // Ejecutar guard
    const result = adminGuard({} as any, {} as any);

    // Verificar
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
```

---

## 10. Resumen Rápido

| Acción | Guard | Resultado |
|--------|-------|-----------|
| Usuario no logueado accede a `/dashboard` | adminGuard | ❌ Redirige a /login |
| USER (BARBER) accede a `/dashboard` | adminGuard | ❌ Redirige a /login |
| USER (ADMIN) accede a `/dashboard` | adminGuard | ✅ Acceso permitido |
| USER (BARBER) accede a `/barber-dashboard` | barberGuard | ✅ Acceso permitido |
| USER (ADMIN) accede a `/barber-dashboard` | barberGuard | ✅ Acceso permitido |
| USER (CLIENT) accede a `/barber-dashboard` | barberGuard | ❌ Redirige a /login |

---

## 11. Configuración para Producción (Render + Neon)

Cuando despliegues a Render, asegúrate de:

```typescript
// environment.production.ts
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-render.onrender.com/api'
};

// El guard seguirá funcionando igual
// Los tokens se validarán en el backend
```

---

**Versión:** 1.0
**Para:** Estudiantes de Citas Barbería
**Última actualización:** 2024
