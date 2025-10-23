import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { DashboardComponent } from './pages/dashboard.component';
import { ClientDashboardComponent } from './pages/client-dashboard.component';
import { BarberDashboardComponent } from './pages/barber-dashboard.component';
import { authGuardFn } from './guards/auth.guard';
import { adminGuard, barberGuard, clientGuard } from './guards/role.guard';

/**
 * CONFIGURACIÓN DE RUTAS - Sistema de Citas Barbería
 *
 * DESCRIPCIÓN:
 * Aquí se definen todas las rutas de la aplicación con su protección.
 * Las rutas públicas (login, register) no requieren autenticación.
 * Las rutas protegidas requieren que el usuario esté logueado y tenga el rol correcto.
 *
 * RUTAS PÚBLICAS (sin protección):
 * - /login      → Página de ingreso
 * - /register   → Página de registro
 * - ''          → Redirige a /login por defecto
 *
 * RUTAS PROTEGIDAS (requieren autenticación + rol específico):
 * - /dashboard          → Solo ADMIN (administrador)
 * - /barber-dashboard   → Solo BARBER (barbero) y ADMIN
 * - /client-dashboard   → Solo CLIENT (cliente) y ADMIN
 *
 * RUTAS NO EXISTENTES:
 * - ** (wildcard)       → Cualquier ruta no definida redirige a /login
 *
 * GUARDS UTILIZADOS:
 * - authGuardFn        → Verifica que el usuario esté autenticado
 * - adminGuard         → Verifica que el usuario sea ADMIN
 * - barberGuard        → Verifica que el usuario sea BARBER o ADMIN
 * - clientGuard        → Verifica que el usuario sea CLIENT o ADMIN
 *
 * @author Sistema de Citas Barbería
 * @version 1.0
 */

export const routes: Routes = [
  // ========================================
  // RUTA RAÍZ - Redirigir a login
  // ========================================
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // ========================================
  // RUTAS PÚBLICAS (Sin protección)
  // ========================================

  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Iniciar Sesión' }
  },

  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Registrarse' }
  },

  // ========================================
  // RUTAS PROTEGIDAS - ADMIN
  // ========================================

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [adminGuard], // Solo ADMIN puede acceder
    data: { title: 'Dashboard - Administrador' }
  },

  // ========================================
  // RUTAS PROTEGIDAS - BARBERO
  // ========================================

  {
    path: 'barber-dashboard',
    component: BarberDashboardComponent,
    canActivate: [barberGuard], // BARBER y ADMIN pueden acceder
    data: { title: 'Dashboard - Barbero' }
  },

  // ========================================
  // RUTAS PROTEGIDAS - CLIENTE
  // ========================================

  {
    path: 'client-dashboard',
    component: ClientDashboardComponent,
    canActivate: [clientGuard], // CLIENT y ADMIN pueden acceder
    data: { title: 'Dashboard - Cliente' }
  },

  // ========================================
  // RUTA WILDCARD - Rutas no definidas
  // ========================================

  {
    path: '**',
    redirectTo: '/login'
  }
];