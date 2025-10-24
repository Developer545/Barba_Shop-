import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, interval } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User, UserRole, LoginData, RegisterData } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl;
  private refreshTokenTimeout?: any;

  constructor(private http: HttpClient) {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      this.currentUserSubject.next(JSON.parse(savedUser));
      this.scheduleTokenRefresh();
    }
  }

  private demoUsers: User[] = [
    {
      id: 1,
      name: 'Carlos Administrador',
      email: 'admin@barbershop.com',
      phone: '+503 7000-0001',
      role: UserRole.ADMIN,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'Miguel Barbero',
      email: 'barber@barbershop.com',
      phone: '+503 7000-0002',
      role: UserRole.BARBER,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=barber',
      createdAt: new Date()
    },
    {
      id: 3,
      name: 'Juan Cliente',
      email: 'client@barbershop.com',
      phone: '+503 7000-0003',
      role: UserRole.CLIENT,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client',
      createdAt: new Date()
    },
    {
      id: 4,
      name: 'Usuario Demo',
      email: 'demo@barbershop.com',
      phone: '+503 7000-0000',
      role: UserRole.CLIENT,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      createdAt: new Date()
    }
  ];

  login(loginData: LoginData): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, loginData)
      .pipe(
        map(response => {
          if (response.token && response.user) {
            // Mapear la respuesta del backend al modelo del frontend
            const user: User = {
              id: response.user.id,
              name: response.user.name,
              email: response.user.email,
              phone: response.user.phone,
              role: this.mapBackendRoleToFrontend(response.user.role),
              avatar: response.user.avatar,
              createdAt: new Date(response.user.createdAt)
            };

            // Guardar token, refresh token y usuario
            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
              localStorage.setItem('refreshToken', response.refreshToken);
            }
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);

            // Schedule automatic token refresh
            this.scheduleTokenRefresh();

            return user;
          }
          throw new Error('Respuesta inválida del servidor');
        }),
        catchError(error => {
          console.error('Error de login:', error);
          // Rechazar login si las credenciales son inválidas
          // No usar fallback a usuarios demo - siempre rechazar
          return throwError(() => new Error('Credenciales inválidas. Por favor, verifica tu correo y contraseña.'));
        })
      );
  }

  register(registerData: RegisterData): Observable<User> {
    // Simulación de registro
    const newUser: User = {
      id: Date.now(), // ID temporal
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      role: UserRole.CLIENT,
      createdAt: new Date()
    };

    localStorage.setItem('currentUser', JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);

    return of(newUser);
  }

  logout(): Observable<string> {
    const token = localStorage.getItem('token');

    // Clear timeout
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    if (token) {
      return this.http.post<any>(`${this.apiUrl}/auth/logout`, {}, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      }).pipe(
        map(() => {
          this.clearAuthData();
          return 'Logged out successfully';
        }),
        catchError(error => {
          console.error('Error during logout:', error);
          // Clear data anyway even if logout fails
          this.clearAuthData();
          return of('Logged out (partial)');
        })
      );
    }

    this.clearAuthData();
    return of('No token to logout');
  }

  private clearAuthData(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
  }

  private mapBackendRoleToFrontend(backendRole: string): UserRole {
    const roleMap: { [key: string]: UserRole } = {
      'ADMIN': UserRole.ADMIN,
      'BARBER': UserRole.BARBER,
      'CLIENT': UserRole.CLIENT
    };
    return roleMap[backendRole] || UserRole.CLIENT;
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  getDemoUsers(): User[] {
    return this.demoUsers;
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const permissions: { [key in UserRole]: string[] } = {
      [UserRole.ADMIN]: ['manage_users', 'manage_barbers', 'manage_services', 'view_reports', 'manage_appointments'],
      [UserRole.BARBER]: ['view_appointments', 'manage_own_appointments', 'view_clients'],
      [UserRole.CLIENT]: ['view_own_appointments', 'book_appointments']
    };

    return permissions[user.role]?.includes(permission) || false;
  }

  // Refresh Token Methods
  private scheduleTokenRefresh(): void {
    // Refresh token 5 minutes before expiration (JWT typically expires in 15 minutes)
    // Schedule refresh every 10 minutes to be safe
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshAccessToken().subscribe({
        next: () => {
          console.log('Token refreshed successfully');
          this.scheduleTokenRefresh(); // Schedule next refresh
        },
        error: (error) => {
          console.error('Failed to refresh token:', error);
          this.logout().subscribe();
        }
      });
    }, 10 * 60 * 1000); // 10 minutes
  }

  refreshAccessToken(): Observable<User> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<any>(`${this.apiUrl}/auth/refresh`, {
      refreshToken: refreshToken
    }).pipe(
      map(response => {
        if (response.token && response.user) {
          // Update token
          localStorage.setItem('token', response.token);

          // Update refresh token if provided
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }

          // Map and update current user
          const user: User = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            phone: response.user.phone,
            role: this.mapBackendRoleToFrontend(response.user.role),
            avatar: response.user.avatar,
            createdAt: new Date(response.user.createdAt)
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);

          return user;
        }
        throw new Error('Invalid response from refresh endpoint');
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.clearAuthData();
        return throwError(() => new Error('Failed to refresh token'));
      })
    );
  }

  validateToken(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      return of(false);
    }

    return this.http.get<boolean>(`${this.apiUrl}/auth/validate-token`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(() => of(false))
    );
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}