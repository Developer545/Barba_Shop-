import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { User, UserRole, LoginData, RegisterData } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      this.currentUserSubject.next(JSON.parse(savedUser));
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

            // Guardar token y usuario
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
          }
          throw new Error('Respuesta inválida del servidor');
        }),
        catchError(error => {
          console.error('Error de login, usando datos demo:', error);
          // Fallback a usuarios demo cuando el backend no está disponible
          const demoUser = this.demoUsers.find(user =>
            user.email === loginData.email
          );

          if (demoUser) {
            // Simular token
            const token = 'demo-token-' + Date.now();
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', JSON.stringify(demoUser));
            this.currentUserSubject.next(demoUser);
            return of(demoUser);
          }

          return throwError(() => new Error('Credenciales inválidas'));
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

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
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
}