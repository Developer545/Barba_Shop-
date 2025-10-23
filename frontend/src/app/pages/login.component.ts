import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginData, User, UserRole } from '../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen relative flex items-center justify-center px-4">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop"
          alt="Barbershop Background"
          class="w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-indigo-900/55 to-purple-800/60"></div>
      </div>

      <!-- Content -->
      <div class="max-w-md w-full relative z-10">
        <!-- Logo y título -->
        <div class="text-center mb-8">
          <div class="mx-auto h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-2xl border border-white/30">
            <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white drop-shadow-lg">BarberShop SaaS</h1>
          <p class="text-gray-200 mt-2 drop-shadow">Inicia sesión en tu cuenta</p>
        </div>

        <!-- Formulario de login -->
        <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <!-- Email -->
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-white mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 transition-all duration-200"
                [class.border-red-400]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                placeholder="tu@ejemplo.com"
              >
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                   class="text-red-300 text-sm mt-1 drop-shadow">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">El email es requerido</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Ingresa un email válido</span>
              </div>
            </div>

            <!-- Password -->
            <div class="mb-6">
              <label for="password" class="block text-sm font-medium text-white mb-2">
                Contraseña
              </label>
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                formControlName="password"
                class="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 transition-all duration-200"
                [class.border-red-400]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="••••••••"
              >
              <button
                type="button"
                (click)="togglePassword()"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                style="position: relative; float: right; margin-top: -32px; margin-right: 8px;"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path *ngIf="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path *ngIf="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  <path *ngIf="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
              </button>
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                   class="text-red-300 text-sm mt-1 drop-shadow">
                <span *ngIf="loginForm.get('password')?.errors?.['required']">La contraseña es requerida</span>
                <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Mínimo 6 caracteres</span>
              </div>
            </div>

            <!-- Mensaje de error -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-xl">
              <p class="text-red-200 text-sm drop-shadow">{{ errorMessage }}</p>
            </div>

            <!-- Botón de login -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full bg-white/25 backdrop-blur-md hover:bg-white/35 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border-2 border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              [class.opacity-50]="loginForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Iniciar Sesión</span>
              <span *ngIf="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando...
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="mt-6 mb-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-white/30"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white/10 text-white/90 backdrop-blur-sm rounded-full">¿No tienes cuenta?</span>
              </div>
            </div>
          </div>

          <!-- Link de registro -->
          <button
            type="button"
            (click)="goToRegister()"
            class="w-full text-center py-3 px-4 text-sm font-semibold rounded-xl text-white bg-white/15 backdrop-blur-sm hover:bg-white/25 border-2 border-white/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Crear cuenta nueva
          </button>
        </div>

        <!-- Real users credentials -->
        <div class="mt-6 p-5 bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30">
          <!-- Header con botón toggle -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-white drop-shadow">Usuarios Disponibles en Base de Datos:</h3>
            <button
              type="button"
              (click)="toggleDemoUsers()"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 transition-all duration-200 transform hover:scale-105 flex items-center space-x-1"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="!showDemoUsers" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path *ngIf="!showDemoUsers" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                <path *ngIf="showDemoUsers" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
              </svg>
              <span>{{ showDemoUsers ? 'Ocultar' : 'Mostrar' }}</span>
            </button>
          </div>

          <!-- Lista de usuarios (se muestra/oculta) -->
          <div *ngIf="showDemoUsers" class="space-y-2">
            <div *ngFor="let user of demoUsers"
                 class="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
                 (click)="selectDemoUser(user)">
              <div class="flex items-center space-x-3">
                <img [src]="user.avatar" [alt]="user.name" class="w-10 h-10 rounded-full border-2 border-white/30">
                <div>
                  <p class="text-sm font-semibold text-white drop-shadow">{{ user.name }}</p>
                  <p class="text-xs text-white/80">{{ user.email }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm"
                      [ngClass]="{
                        'bg-red-400/30 text-red-100 border border-red-300/50': user.role === 'admin',
                        'bg-blue-400/30 text-blue-100 border border-blue-300/50': user.role === 'barber',
                        'bg-green-400/30 text-green-100 border border-green-300/50': user.role === 'client'
                      }">
                  {{ getRoleLabel(user.role) }}
                </span>
              </div>
            </div>
            <p class="text-xs text-white/90 mt-4 font-medium drop-shadow text-center">✨ Haz clic en cualquier usuario para usar sus credenciales</p>
          </div>

          <!-- Mensaje cuando está oculto -->
          <div *ngIf="!showDemoUsers" class="text-center py-4">
            <p class="text-sm text-white/70">Usuarios ocultos. Haz clic en "Mostrar" para verlos.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showDemoUsers = false;
  demoUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@barbershop.com', [Validators.required, Validators.email]],
      password: ['password123', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Usuarios reales de la base de datos
    this.demoUsers = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@barbershop.com',
        phone: '+503 7000-0001',
        role: UserRole.ADMIN,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser',
        createdAt: new Date()
      },
      {
        id: 2,
        name: 'Miguel García',
        email: 'miguel@barbershop.com',
        phone: '+503 7000-0002',
        role: UserRole.BARBER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MiguelGarcia',
        createdAt: new Date()
      },
      {
        id: 3,
        name: 'Carlos López',
        email: 'carlos@barbershop.com',
        phone: '+503 7000-0003',
        role: UserRole.BARBER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosLopez',
        createdAt: new Date()
      },
      {
        id: 4,
        name: 'Roberto Martínez',
        email: 'roberto@barbershop.com',
        phone: '+503 7000-0004',
        role: UserRole.BARBER,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RobertoMartinez',
        createdAt: new Date()
      },
      {
        id: 5,
        name: 'Juan Pérez',
        email: 'juan@email.com',
        phone: '+503 7000-0005',
        role: UserRole.CLIENT,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JuanPerez',
        createdAt: new Date()
      },
      {
        id: 6,
        name: 'Ana Rodríguez',
        email: 'ana@email.com',
        phone: '+503 7000-0006',
        role: UserRole.CLIENT,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnaRodriguez',
        createdAt: new Date()
      },
      {
        id: 7,
        name: 'Pedro Hernández',
        email: 'pedro@email.com',
        phone: '+503 7000-0007',
        role: UserRole.CLIENT,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PedroHernandez',
        createdAt: new Date()
      }
    ];
  }

  selectDemoUser(user: User): void {
    const password = this.getPasswordForUser(user.email);
    this.loginForm.patchValue({
      email: user.email,
      password: password
    });
  }

  private getPasswordForUser(email: string): string {
    // Todas las contraseñas de la base de datos son 'password123'
    const passwords: { [key: string]: string } = {
      'admin@barbershop.com': 'password123',
      'miguel@barbershop.com': 'password123',
      'carlos@barbershop.com': 'password123',
      'roberto@barbershop.com': 'password123',
      'juan@email.com': 'password123',
      'ana@email.com': 'password123',
      'pedro@email.com': 'password123'
    };
    return passwords[email] || 'password123';
  }

  getRoleLabel(role: UserRole): string {
    const labels: { [key in UserRole]: string } = {
      [UserRole.ADMIN]: 'Administrador',
      [UserRole.BARBER]: 'Barbero',
      [UserRole.CLIENT]: 'Cliente'
    };
    return labels[role];
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData: LoginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      try {
        this.authService.login(loginData).subscribe({
          next: (user) => {
            this.isLoading = false;
            console.log('Usuario logueado:', user);
            // Redirigir según el rol del usuario
            if (user.role === UserRole.ADMIN) {
              this.router.navigate(['/dashboard']);
            } else if (user.role === UserRole.BARBER) {
              this.router.navigate(['/barber-dashboard']);
            } else {
              this.router.navigate(['/client-dashboard']);
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Credenciales inválidas. Usa uno de los usuarios de la base de datos.';
          }
        });
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = 'Credenciales inválidas. Usa uno de los usuarios de la base de datos.';
      }
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleDemoUsers(): void {
    this.showDemoUsers = !this.showDemoUsers;
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}