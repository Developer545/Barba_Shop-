import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AUTH GUARD - Protege rutas que requieren autenticación
 *
 * DESCRIPCIÓN:
 * Este guard verifica si el usuario está autenticado (tiene sesión activa).
 * Si no está autenticado, lo redirige a la página de login.
 *
 * FORMA MODERNA (Angular 15+):
 * En lugar de usar clases, usamos funciones. Es más simple y menos código.
 *
 * USO EN RUTAS:
 * {
 *   path: 'alguna-ruta',
 *   component: AlgunComponente,
 *   canActivate: [authGuardFn]
 * }
 *
 * FLUJO DE EJECUCIÓN:
 * 1. Usuario intenta acceder a una ruta protegida
 * 2. Angular ejecuta este guard automáticamente
 * 3. Guard verifica: ¿isAuthenticated() retorna true?
 *    ✅ SI  → Permite acceso a la ruta
 *    ❌ NO  → Redirige a /login
 *
 * MÉTODO USADO:
 * - inject(AuthService) → Inyecta el servicio de autenticación
 * - inject(Router) → Inyecta el router para navegar
 * - authService.isAuthenticated() → Verifica si hay sesión activa
 *
 * @author Sistema de Citas Barbería
 * @version 1.0
 */

/**
 * Guard funcional de autenticación (RECOMENDADO)
 *
 * Este es el guard genérico para verificar que el usuario esté autenticado.
 * Se utiliza cuando necesitas proteger una ruta pero no importa el rol específico.
 *
 * EJEMPLO:
 * Si tienes una ruta que cualquier usuario logueado puede ver (admin, barber o client),
 * usa este guard en lugar de los guards específicos de rol.
 */
export const authGuardFn: CanActivateFn = () => {
  // Inyectar servicios necesarios
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (authService.isAuthenticated()) {
    return true;  // ✅ Permitir acceso
  }

  // Usuario no autenticado - redirigir a login
  console.warn('❌ Acceso denegado: Usuario no autenticado');
  router.navigate(['/login']);
  return false;  // ❌ Denegar acceso
};
