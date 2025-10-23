import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterData } from '../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4">
      <div class="max-w-md w-full">
        <!-- Logo y título -->
        <div class="text-center mb-8">
          <div class="mx-auto h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
          <p class="text-gray-600 mt-2">Únete a BarberShop SaaS</p>
        </div>

        <!-- Formulario de registro -->
        <div class="card">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- Nombre -->
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                formControlName="name"
                class="input-field"
                [class.border-red-500]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
                placeholder="Tu nombre completo"
              >
              <div *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
                   class="text-red-500 text-sm mt-1">
                <span *ngIf="registerForm.get('name')?.errors?.['required']">El nombre es requerido</span>
              </div>
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="input-field"
                [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                placeholder="tu@ejemplo.com"
              >
              <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                   class="text-red-500 text-sm mt-1">
                <span *ngIf="registerForm.get('email')?.errors?.['required']">El email es requerido</span>
                <span *ngIf="registerForm.get('email')?.errors?.['email']">Ingresa un email válido</span>
              </div>
            </div>

            <!-- Teléfono -->
            <div class="mb-4">
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                formControlName="phone"
                class="input-field"
                [class.border-red-500]="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched"
                placeholder="+503 0000-0000"
              >
              <div *ngIf="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched"
                   class="text-red-500 text-sm mt-1">
                <span *ngIf="registerForm.get('phone')?.errors?.['required']">El teléfono es requerido</span>
              </div>
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                formControlName="password"
                class="input-field"
                [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                placeholder="••••••••"
              >
              <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                   class="text-red-500 text-sm mt-1">
                <span *ngIf="registerForm.get('password')?.errors?.['required']">La contraseña es requerida</span>
                <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Mínimo 6 caracteres</span>
              </div>
            </div>

            <!-- Confirmar Password -->
            <div class="mb-6">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="confirmPassword"
                formControlName="confirmPassword"
                class="input-field"
                [class.border-red-500]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                placeholder="••••••••"
              >
              <button
                type="button"
                (click)="togglePassword()"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              <div *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                   class="text-red-500 text-sm mt-1">
                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Confirma tu contraseña</span>
              </div>
              <div *ngIf="passwordMismatch" class="text-red-500 text-sm mt-1">
                Las contraseñas no coinciden
              </div>
            </div>

            <!-- Mensaje de error -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-600 text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Botón de registro -->
            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading || passwordMismatch"
              class="btn-primary w-full"
              [class.opacity-50]="registerForm.invalid || isLoading || passwordMismatch"
            >
              <span *ngIf="!isLoading">Crear Cuenta</span>
              <span *ngIf="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando cuenta...
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="mt-6 mb-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
              </div>
            </div>
          </div>

          <!-- Link de login -->
          <button
            type="button"
            (click)="goToLogin()"
            class="w-full text-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors duration-200"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  get passwordMismatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password !== confirmPassword && confirmPassword !== '';
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.passwordMismatch) {
      this.isLoading = true;
      this.errorMessage = '';

      const registerData: RegisterData = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        phone: this.registerForm.value.phone,
        password: this.registerForm.value.password
      };

      this.authService.register(registerData).subscribe({
        next: (user) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error al crear la cuenta. Inténtalo de nuevo.';
        }
      });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}