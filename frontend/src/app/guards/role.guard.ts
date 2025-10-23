import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * ROLE GUARD - Protege rutas según el rol del usuario
 *
 * DESCRIPCIÓN:
 * Este guard verifica si el usuario tiene el rol requerido para acceder a una ruta.
 * Cada ruta protegida puede especificar qué roles tienen acceso.
 *
 * ROLES DISPONIBLES:
 * - UserRole.ADMIN    → Acceso total a todas las funciones administrativas
 * - UserRole.BARBER   → Acceso a funciones de barbero
 * - UserRole.CLIENT   → Acceso a funciones de cliente
 *
 * USO EN RUTAS:
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [roleGuard],
 *   data: { roles: ['ADMIN'] }
 * }
 *
 * FLUJO:
 * 1. Usuario intenta acceder a una ruta protegida
 * 2. Guard lee el array de roles en route.data.roles
 * 3. Verifica si el usuario actual tiene uno de esos roles
 * 4. Si tiene el rol → Permite acceso
 * 5. Si NO tiene el rol → Redirige a /login (no autorizado)
 *
 * EJEMPLO AVANZADO:
 * {
 *   path: 'barber-dashboard',
 *   component: BarberDashboardComponent,
 *   canActivate: [roleGuard],
 *   data: { roles: ['BARBER', 'ADMIN'] }  // BARBER o ADMIN pueden acceder
 * }
 *
 * @author Sistema de Citas Barbería
 * @version 1.0
 */

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Verifica si el usuario tiene el rol necesario
   * @param route - Información de la ruta actual
   * @param state - Estado del router
   * @returns true si tiene el rol, false si no
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Obtener los roles requeridos de la configuración de la ruta
    const requiredRoles = route.data['roles'] as string[];

    // Si no hay roles especificados, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtener el rol del usuario actual
    const user = this.authService.getCurrentUser();

    // Verificar si el usuario tiene uno de los roles requeridos
    if (user && requiredRoles.includes(user.role)) {
      return true;
    }

    // Usuario no autorizado - redirigir a login
    this.router.navigate(['/login']);
    return false;
  }
}

/**
 * GUARD FUNCIONAL REUTILIZABLE (RECOMENDADO)
 *
 * Esta es la implementación moderna de Angular 15+.
 * Más simple, limpia y fácil de entender.
 *
 * VENTAJAS:
 * - Código más conciso
 * - Sin necesidad de inyectar dependencias en el constructor
 * - Más fácil de probar (testing)
 * - Patrón funcional moderno
 */
export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // Inyectar dependencias necesarias
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener los roles requeridos configurados en la ruta
  const requiredRoles = route.data['roles'] as string[];

  // Validar que haya roles configurados
  if (!requiredRoles || requiredRoles.length === 0) {
    console.warn(
      `⚠️ Advertencia: No hay roles configurados para la ruta ${route.routeConfig?.path}`
    );
    return true;
  }

  // Obtener el usuario actual
  const user = authService.getCurrentUser();

  // Verificar si el usuario existe y tiene uno de los roles requeridos
  if (user && requiredRoles.includes(user.role)) {
    return true;
  }

  // Usuario no tiene permiso - redirigir
  console.warn(
    `❌ Acceso denegado: Usuario sin permiso para ${route.routeConfig?.path}`
  );
  router.navigate(['/login']);
  return false;
};

/**
 * GUARD ESPECÍFICO PARA ADMIN
 *
 * Guard simplificado para rutas solo de administrador.
 * Más específico y fácil de usar cuando solo necesitas un rol.
 *
 * USO:
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [adminGuard]
 * }
 */
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasRole(UserRole.ADMIN)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/**
 * GUARD ESPECÍFICO PARA BARBERO
 *
 * Guard simplificado para rutas de barbero.
 *
 * USO:
 * {
 *   path: 'barber-dashboard',
 *   component: BarberDashboardComponent,
 *   canActivate: [barberGuard]
 * }
 */
export const barberGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  // Barbero o Admin pueden acceder
  if (user && (user.role === UserRole.BARBER || user.role === UserRole.ADMIN)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/**
 * GUARD ESPECÍFICO PARA CLIENTE
 *
 * Guard simplificado para rutas de cliente.
 *
 * USO:
 * {
 *   path: 'client-dashboard',
 *   component: ClientDashboardComponent,
 *   canActivate: [clientGuard]
 * }
 */
export const clientGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  // Cliente o Admin pueden acceder
  if (user && (user.role === UserRole.CLIENT || user.role === UserRole.ADMIN)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
