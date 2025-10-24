import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-barber-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <!-- Navigation Header -->
      <nav class="bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-3">
              <div class="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <span class="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">BarberShop</span>
            </div>

            <div class="flex items-center space-x-4">
              <!-- User Info -->
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">{{ currentUser?.name }}</p>
                  <p class="text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Barbero</p>
                </div>
                <div class="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50">
                  <span class="text-white font-bold text-sm">
                    {{ currentUser?.name?.charAt(0)?.toUpperCase() }}
                  </span>
                </div>
              </div>

              <!-- Logout Button -->
              <button
                (click)="logout()"
                class="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200 transition-all duration-200 transform hover:scale-110 shadow-md"
                title="Cerrar sesión"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Welcome Section -->
        <div class="mb-10 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            ¡Bienvenido, {{ currentUser?.name }}!
          </h1>
          <p class="text-gray-600 font-medium">Panel de Control - Barbero</p>
        </div>

        <!-- Tabbed Section -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 overflow-hidden mb-8">
          <!-- Tab Navigation - Responsive -->
          <div class="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border-b border-indigo-100 overflow-x-auto">
            <nav class="flex space-x-1 sm:space-x-2 p-2 min-w-min sm:min-w-0">
              <button *ngFor="let tab of tabs"
                      (click)="activeTab = tab.id"
                      [class]="activeTab === tab.id
                        ? 'bg-white shadow-lg text-indigo-600 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 sm:flex-shrink'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 sm:flex-shrink'">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="tab.icon"/>
                </svg>
                <span class="hidden sm:inline">{{ tab.name }}</span>
                <span *ngIf="tab.id === 'mis-citas'" class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-md">{{ appointments.length }}</span>
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">

            <!-- Mis Citas Tab - Responsive Design -->
            <div *ngIf="activeTab === 'mis-citas'" class="tab-content">
              <h2 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">Mis Citas Programadas</h2>

              <!-- Desktop Table View -->
              <div class="hidden md:block overflow-x-auto">
                <table class="w-full table-auto">
                  <thead>
                    <tr class="border-b-2 border-indigo-100">
                      <th class="text-left py-3 px-3 lg:py-4 lg:px-4 font-semibold text-xs lg:text-sm text-gray-700">Cliente</th>
                      <th class="text-left py-3 px-3 lg:py-4 lg:px-4 font-semibold text-xs lg:text-sm text-gray-700">Servicio</th>
                      <th class="text-left py-3 px-3 lg:py-4 lg:px-4 font-semibold text-xs lg:text-sm text-gray-700">Fecha</th>
                      <th class="text-left py-3 px-3 lg:py-4 lg:px-4 font-semibold text-xs lg:text-sm text-gray-700">Hora</th>
                      <th class="text-left py-3 px-3 lg:py-4 lg:px-4 font-semibold text-xs lg:text-sm text-gray-700">Estado</th>
                      <th class="text-left py-3 px-3 lg:py-4 lg:px-4 font-semibold text-xs lg:text-sm text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let appointment of appointments" class="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                      <td class="py-3 px-3 lg:py-4 lg:px-4">
                        <div>
                          <div class="text-xs lg:text-sm font-semibold text-gray-900">{{ appointment.clientName }}</div>
                          <div class="text-xs text-gray-500">{{ appointment.clientPhone }}</div>
                        </div>
                      </td>
                      <td class="py-3 px-3 lg:py-4 lg:px-4 text-xs lg:text-sm font-medium text-gray-700">
                        {{ appointment.serviceName }}
                      </td>
                      <td class="py-3 px-3 lg:py-4 lg:px-4 text-xs lg:text-sm text-gray-700">
                        {{ appointment.date }}
                      </td>
                      <td class="py-3 px-3 lg:py-4 lg:px-4 text-xs lg:text-sm font-semibold text-gray-900">
                        {{ appointment.time }}
                      </td>
                      <td class="py-3 px-3 lg:py-4 lg:px-4">
                        <span [class]="getStatusClass(appointment.status)"
                              class="px-2 lg:px-3 py-1 text-xs font-bold rounded-full shadow-md">
                          {{ getStatusText(appointment.status) }}
                        </span>
                      </td>
                      <td class="py-3 px-3 lg:py-4 lg:px-4 text-xs lg:text-sm font-medium space-x-1 lg:space-x-2">
                        <button *ngIf="appointment.status === 'PENDING'"
                                (click)="confirmAppointment(appointment.id)"
                                class="px-2 lg:px-3 py-1 lg:py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md">
                          Confirmar
                        </button>
                        <button *ngIf="appointment.status === 'CONFIRMED'"
                                (click)="completeAppointment(appointment.id)"
                                class="px-2 lg:px-3 py-1 lg:py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md">
                          Completar
                        </button>
                        <button *ngIf="appointment.status === 'PENDING' || appointment.status === 'CONFIRMED'"
                                (click)="cancelAppointment(appointment.id)"
                                class="px-2 lg:px-3 py-1 lg:py-1.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-semibold rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-md">
                          Cancelar
                        </button>
                      </td>
                    </tr>
                    <tr *ngIf="appointments.length === 0">
                      <td colspan="6" class="px-4 py-8 text-center text-gray-500 font-medium">
                        No tienes citas programadas
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Card View -->
              <div class="md:hidden space-y-3">
                <div *ngFor="let appointment of appointments"
                     class="bg-gradient-to-r from-white to-indigo-50 border-2 border-indigo-100 rounded-lg p-3 hover:shadow-lg transition-all duration-200">
                  <div class="space-y-2">
                    <!-- Cliente -->
                    <div class="flex items-start gap-2">
                      <span class="font-semibold text-gray-700 text-xs whitespace-nowrap">Cliente:</span>
                      <div class="flex-1 min-w-0">
                        <p class="font-semibold text-gray-900 text-sm truncate">{{ appointment.clientName }}</p>
                        <p class="text-xs text-gray-500">{{ appointment.clientPhone }}</p>
                      </div>
                    </div>

                    <!-- Servicio -->
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-gray-700 text-xs whitespace-nowrap">Servicio:</span>
                      <span class="text-sm text-gray-700">{{ appointment.serviceName }}</span>
                    </div>

                    <!-- Fecha y Hora -->
                    <div class="flex gap-3">
                      <div class="flex-1">
                        <span class="font-semibold text-gray-700 text-xs">Fecha</span>
                        <p class="text-sm text-gray-700">{{ appointment.date }}</p>
                      </div>
                      <div class="flex-1">
                        <span class="font-semibold text-gray-700 text-xs">Hora</span>
                        <p class="text-sm font-semibold text-gray-900">{{ appointment.time }}</p>
                      </div>
                    </div>

                    <!-- Estado -->
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-gray-700 text-xs whitespace-nowrap">Estado:</span>
                      <span [class]="getStatusClass(appointment.status)"
                            class="px-2 py-1 text-xs font-bold rounded-full shadow-md">
                        {{ getStatusText(appointment.status) }}
                      </span>
                    </div>

                    <!-- Acciones -->
                    <div class="flex gap-2 pt-2 flex-wrap">
                      <button *ngIf="appointment.status === 'PENDING'"
                              (click)="confirmAppointment(appointment.id)"
                              class="flex-1 px-2 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md">
                        Confirmar
                      </button>
                      <button *ngIf="appointment.status === 'CONFIRMED'"
                              (click)="completeAppointment(appointment.id)"
                              class="flex-1 px-2 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md">
                        Completar
                      </button>
                      <button *ngIf="appointment.status === 'PENDING' || appointment.status === 'CONFIRMED'"
                              (click)="cancelAppointment(appointment.id)"
                              class="flex-1 px-2 py-1.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-semibold rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-md">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>

                <div *ngIf="appointments.length === 0" class="text-center py-8 text-gray-500 font-medium bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border-2 border-gray-200">
                  No tienes citas programadas
                </div>
              </div>
            </div>

            <!-- Mi Horario Tab -->
            <div *ngIf="activeTab === 'mi-horario'" class="tab-content">
              <h2 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Mi Horario de Trabajo</h2>

              <div class="space-y-3">
                <div *ngFor="let schedule of barberSchedule" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div>
                        <span class="text-base font-bold text-gray-900">{{ getDayName(schedule.dayOfWeek) }}</span>
                        <p class="text-sm text-gray-700 font-semibold mt-1">{{ schedule.startTime }} - {{ schedule.endTime }}</p>
                      </div>
                    </div>
                    <span [class]="schedule.isAvailable ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'"
                          class="px-4 py-2 text-xs font-bold text-white rounded-full shadow-md">
                      {{ schedule.isAvailable ? 'Disponible' : 'No disponible' }}
                    </span>
                  </div>
                </div>
                <div *ngIf="barberSchedule.length === 0" class="text-center text-gray-500 py-12 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border-2 border-gray-200">
                  <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p class="font-semibold">No tienes horarios configurados</p>
                </div>
              </div>
            </div>

            <!-- Mi Perfil Tab -->
            <div *ngIf="activeTab === 'mi-perfil'" class="tab-content">
              <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Mi Perfil</h2>

              <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 shadow-md" *ngIf="barberProfile">
                <div class="flex items-start space-x-6 mb-6">
                  <div class="relative">
                    <img [src]="currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser?.name"
                         [alt]="currentUser?.name"
                         class="w-24 h-24 rounded-full border-4 border-white shadow-lg">
                    <div class="absolute -bottom-1 -right-1 h-7 w-7 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ currentUser?.name }}</h3>
                    <p class="text-gray-600 font-medium mb-4">{{ currentUser?.email }}</p>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-white rounded-lg p-3 shadow-sm">
                        <label class="text-sm text-gray-600 font-medium">Teléfono</label>
                        <p class="text-gray-900 font-semibold">{{ currentUser?.phone || 'No disponible' }}</p>
                      </div>
                      <div class="bg-white rounded-lg p-3 shadow-sm">
                        <label class="text-sm text-gray-600 font-medium">Experiencia</label>
                        <p class="text-gray-900 font-semibold">{{ barberProfile.experience || '5+' }} años</p>
                      </div>
                      <div class="bg-white rounded-lg p-3 shadow-sm">
                        <label class="text-sm text-gray-600 font-medium">Calificación</label>
                        <p class="text-gray-900 font-semibold">⭐ {{ barberProfile.rating || '4.9' }} / 5.0</p>
                      </div>
                      <div class="bg-white rounded-lg p-3 shadow-sm">
                        <label class="text-sm text-gray-600 font-medium">Estado</label>
                        <p [class]="barberProfile.isActive ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                          {{ barberProfile.isActive ? 'Activo' : 'Inactivo' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-4" *ngIf="barberProfile.specialties && barberProfile.specialties.length > 0">
                  <label class="text-sm font-semibold text-gray-700 mb-2 block">Especialidades</label>
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let specialty of barberProfile.specialties"
                          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-full shadow-md">
                      {{ specialty }}
                    </span>
                  </div>
                </div>

                <div *ngIf="barberProfile.description" class="mb-4">
                  <label class="text-sm font-semibold text-gray-700 mb-2 block">Descripción</label>
                  <div class="bg-white rounded-lg p-4 shadow-sm">
                    <p class="text-gray-900">{{ barberProfile.description }}</p>
                  </div>
                </div>

                <button class="mt-4 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Editar Perfil
                </button>
              </div>

              <div *ngIf="!barberProfile" class="text-center text-gray-500 py-12 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border-2 border-gray-200">
                <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <p class="font-semibold">Cargando perfil...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .card {
      @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
    }
  `]
})
export class BarberDashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeTab: string = 'mis-citas';
  appointments: any[] = [];
  barberSchedule: any[] = [];
  barberProfile: any = null;

  tabs = [
    { id: 'mis-citas', name: 'Mis Citas', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'mi-horario', name: 'Mi Horario', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'mi-perfil', name: 'Mi Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('DEBUG - Current barber user:', this.currentUser);
    this.loadBarberData();
  }

  loadBarberData(): void {
    if (!this.currentUser) return;

    // Cargar perfil del barbero autenticado
    this.dataService.getMyBarberProfile().subscribe({
      next: (barber) => {
        if (barber) {
          this.barberProfile = barber;
          console.log('Barber profile loaded:', this.barberProfile);
        }
      },
      error: (error) => console.error('Error loading barber profile:', error)
    });

    // Cargar horario semanal del barbero
    this.dataService.getMySchedule().subscribe({
      next: (schedules) => {
        this.barberSchedule = schedules.filter(s => s.isAvailable);
        console.log('Barber schedule loaded:', this.barberSchedule);
      },
      error: (error) => console.error('Error loading barber schedule:', error)
    });

    // Cargar citas del barbero
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.dataService.getBarberAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        console.log('Barber appointments loaded:', appointments);
      },
      error: (error) => console.error('Error loading barber appointments:', error)
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: any = {
      'PENDING': 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white',
      'CONFIRMED': 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
      'COMPLETED': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
      'CANCELLED': 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
    };
    return statusClasses[status] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
  }

  getStatusText(status: string): string {
    const statusTexts: any = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmada',
      'COMPLETED': 'Completada',
      'CANCELLED': 'Cancelada'
    };
    return statusTexts[status] || status;
  }

  getDayName(dayOfWeek: number): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayOfWeek] || '';
  }

  confirmAppointment(id: number): void {
    if (confirm('¿Confirmar esta cita?')) {
      this.dataService.confirmAppointment(id).subscribe({
        next: () => {
          alert('Cita confirmada exitosamente');
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error confirming appointment:', error);
          alert('Error al confirmar la cita');
        }
      });
    }
  }

  completeAppointment(id: number): void {
    if (confirm('¿Marcar esta cita como completada?')) {
      this.dataService.completeAppointment(id).subscribe({
        next: () => {
          alert('Cita marcada como completada');
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error completing appointment:', error);
          alert('Error al completar la cita');
        }
      });
    }
  }

  cancelAppointment(id: number): void {
    const reason = prompt('Motivo de la cancelación:');
    if (reason) {
      this.dataService.cancelBarberAppointment(id, reason).subscribe({
        next: () => {
          alert('Cita cancelada exitosamente');
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          alert('Error al cancelar la cita');
        }
      });
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
