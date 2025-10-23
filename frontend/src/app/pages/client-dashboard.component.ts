import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { Service, ServiceCategory } from '../models/service.model';
import { Barber } from '../models/barber.model';
import { User } from '../models/user.model';
import { AppointmentSchedulerComponent } from './appointment-scheduler.component';
import { AppointmentsCalendarComponent } from './appointments-calendar.component';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, AppointmentSchedulerComponent, AppointmentsCalendarComponent],
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
                  <p class="text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{{ getRoleLabel(currentUser?.role) }}</p>
                </div>
                <div class="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50">
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
          <p class="text-gray-600 font-medium">Reserva tu próxima cita con nosotros</p>
        </div>

        <!-- Tabbed Section -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 overflow-hidden mb-8">
          <!-- Tab Navigation -->
          <div class="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border-b border-indigo-100">
            <nav class="flex space-x-2 p-2">
              <button *ngFor="let tab of tabs"
                      (click)="activeTab = tab.id"
                      [class]="activeTab === tab.id
                        ? 'bg-white shadow-lg text-indigo-600 px-4 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all duration-300 transform scale-105'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50 px-4 py-3 rounded-xl font-medium text-sm flex items-center space-x-2 transition-all duration-300'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="tab.icon"/>
                </svg>
                <span>{{ tab.name }}</span>
                <span *ngIf="tab.id === 'mis-citas'" class="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">{{ appointments.length }}</span>
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">

            <!-- Servicios Tab -->
            <div *ngIf="activeTab === 'servicios'" class="tab-content">
              <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Nuestros Servicios</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div *ngFor="let service of services"
                     class="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                     (click)="selectService(service)">
                  <div class="relative overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                    <img [src]="service.image" [alt]="service.name" class="w-full h-40 object-contain group-hover:scale-110 transition-transform duration-300">
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">{{ service.name }}</h3>
                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ service.description }}</p>
                  <div class="flex justify-between items-center mb-4">
                    <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">\${{ service.price }}</span>
                    <span class="px-3 py-1 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 text-xs font-semibold rounded-full shadow-sm">
                      <svg class="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ service.duration }} min
                    </span>
                  </div>
                  <button class="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-105">
                    Agendar Cita
                  </button>
                </div>
              </div>

              <div *ngIf="services.length === 0" class="text-center py-16 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border-2 border-gray-200">
                <svg class="h-20 w-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                </svg>
                <p class="text-gray-500 font-semibold">No hay servicios disponibles</p>
              </div>
            </div>

            <!-- Barberos Tab -->
            <div *ngIf="activeTab === 'barberos'" class="tab-content">
              <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Nuestros Barberos</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div *ngFor="let barber of barbers"
                     class="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div class="flex items-start mb-4">
                    <div class="relative">
                      <img [src]="barber.avatar" [alt]="barber.name" class="w-20 h-20 rounded-full border-4 border-white shadow-lg ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition-all duration-300">
                      <div class="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-3 border-white"></div>
                    </div>
                    <div class="ml-4 flex-1">
                      <h3 class="text-xl font-bold text-gray-900 mb-1">{{ barber.name }}</h3>
                      <div class="flex items-center mb-2">
                        <span class="text-yellow-500 text-lg mr-1">★</span>
                        <span class="text-sm font-semibold text-gray-700">{{ barber.rating }} / 5.0</span>
                      </div>
                      <span class="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold rounded-full shadow-md">
                        Disponible
                      </span>
                    </div>
                  </div>

                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ barber.description }}</p>

                  <div class="mb-4">
                    <p class="text-xs font-semibold text-gray-700 mb-2">Especialidades:</p>
                    <div class="flex flex-wrap gap-2">
                      <span *ngFor="let specialty of barber.specialties"
                            class="px-3 py-1 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200 shadow-sm">
                        {{ specialty }}
                      </span>
                    </div>
                  </div>

                  <button (click)="selectBarber(barber)"
                          class="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-105">
                    Agendar con {{ barber.name.split(' ')[0] }}
                  </button>
                </div>
              </div>

              <div *ngIf="barbers.length === 0" class="text-center py-16 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border-2 border-gray-200">
                <svg class="h-20 w-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <p class="text-gray-500 font-semibold">No hay barberos disponibles</p>
              </div>
            </div>

            <!-- Mis Citas Tab - Interactive Calendar View -->
            <div *ngIf="activeTab === 'mis-citas'" class="tab-content">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Mis Citas</h2>
                <button (click)="openAppointmentModal()"
                        class="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-105 flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <span>Nueva Cita</span>
                </button>
              </div>

              <div class="space-y-6">
                <!-- Calendar View -->
                <app-appointments-calendar [appointments]="appointments"></app-appointments-calendar>

                <!-- List View -->
                <div class="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg class="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    Detalles de Citas
                  </h3>

                  <div *ngIf="appointments.length === 0" class="text-center py-12 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border-2 border-gray-200">
                    <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-gray-500 font-semibold mb-4">No tienes citas agendadas</p>
                    <button (click)="openAppointmentModal()"
                            class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-xl">
                      Agendar Primera Cita
                    </button>
                  </div>

                  <div *ngIf="appointments.length > 0" class="space-y-3">
                    <div *ngFor="let appointment of appointments"
                         class="bg-gradient-to-r from-white to-indigo-50 border-2 border-indigo-100 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                      <div class="flex justify-between items-start">
                        <div class="flex-1">
                          <p class="font-bold text-gray-900 text-lg">{{ appointment.serviceName }}</p>
                          <div class="mt-2 space-y-1 text-sm text-gray-600">
                            <p>
                              <span class="font-semibold">Barbero:</span>
                              <span class="text-gray-700 ml-2">{{ appointment.barberName }}</span>
                            </p>
                            <p>
                              <span class="font-semibold">Fecha y Hora:</span>
                              <span class="text-gray-700 ml-2">
                                {{ appointment.date | date:'d MMMM':'' : 'es' }} - {{ appointment.time }}
                              </span>
                            </p>
                            <p *ngIf="appointment.notes">
                              <span class="font-semibold">Notas:</span>
                              <span class="text-gray-700 ml-2">{{ appointment.notes }}</span>
                            </p>
                          </div>
                        </div>
                        <div class="flex flex-col items-end space-y-2">
                          <span [class]="getStatusClass(appointment.status)"
                                class="px-4 py-1.5 text-xs font-bold rounded-full shadow-md">
                            {{ getStatusText(appointment.status) }}
                          </span>
                          <button *ngIf="appointment.status === 'PENDING' || appointment.status === 'CONFIRMED'"
                                  (click)="cancelMyAppointment(appointment.id)"
                                  class="px-4 py-1.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-semibold rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Modal para Agendar Cita - New Interactive Calendar Scheduler -->
      <div *ngIf="showAppointmentModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/40 p-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all duration-300">
          <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-indigo-200">
            <h2 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              <svg class="w-8 h-8 inline-block mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Agendar Nueva Cita
            </h2>
            <button (click)="closeAppointmentModal()"
                    class="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200 transition-all duration-200 transform hover:scale-110 shadow-md">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- New Appointment Scheduler Component -->
          <app-appointment-scheduler
            [services]="services"
            [barbers]="barbers"
            (cancel)="closeAppointmentModal()"
            (submit)="onSubmitAppointment($event)">
          </app-appointment-scheduler>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tab-content {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ClientDashboardComponent implements OnInit {
  currentUser: User | null = null;
  services: Service[] = [];
  barbers: Barber[] = [];
  appointments: any[] = [];
  activeTab: string = 'servicios';
  showAppointmentModal: boolean = false;
  appointmentForm: FormGroup;
  availableTimeSlots: string[] = [];
  minDate: string = '';

  // Availability tracking
  isLoadingSlots: boolean = false;
  slotsLoadError: string = '';
  selectedBarberUnavailableMessage: string = '';
  allSlotsTaken: boolean = false;

  tabs = [
    { id: 'servicios', name: 'Servicios', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'barberos', name: 'Barberos', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'mis-citas', name: 'Mis Citas', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
  ];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      serviceId: ['', Validators.required],
      barberId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('DEBUG - Current user in client dashboard:', this.currentUser);
    console.log('DEBUG - LocalStorage currentUser:', localStorage.getItem('currentUser'));
    console.log('DEBUG - LocalStorage token:', localStorage.getItem('token'));
    this.loadData();
    this.loadAppointments();
    this.setMinDate();
    this.setupFormValueListeners();
  }

  setupFormValueListeners(): void {
    // Watch for barberId and date changes to load available slots dynamically
    this.appointmentForm.get('barberId')?.valueChanges.subscribe(() => {
      this.onBarberOrDateChange();
    });

    this.appointmentForm.get('date')?.valueChanges.subscribe(() => {
      this.onBarberOrDateChange();
    });
  }

  onBarberOrDateChange(): void {
    const barberId = this.appointmentForm.get('barberId')?.value;
    const date = this.appointmentForm.get('date')?.value;

    // Clear previous selections and errors
    this.appointmentForm.patchValue({ time: '' }, { emitEvent: false });
    this.slotsLoadError = '';
    this.selectedBarberUnavailableMessage = '';
    this.allSlotsTaken = false;

    if (barberId && date) {
      this.loadAvailableSlots(barberId, date);
    } else {
      this.availableTimeSlots = [];
    }
  }

  loadAvailableSlots(barberId: any, date: string): void {
    this.isLoadingSlots = true;
    this.availableTimeSlots = [];

    this.dataService.getAvailableTimeSlots(barberId, date).subscribe({
      next: (slots) => {
        this.availableTimeSlots = slots;
        this.isLoadingSlots = false;

        if (slots.length === 0) {
          this.allSlotsTaken = true;
          this.slotsLoadError = 'No hay horarios disponibles para este barbero en la fecha seleccionada. Por favor, elige otra fecha.';
        } else {
          this.allSlotsTaken = false;
        }
      },
      error: (error) => {
        this.isLoadingSlots = false;
        this.availableTimeSlots = [];
        this.allSlotsTaken = true;
        console.error('Error loading available slots:', error);
        this.slotsLoadError = 'No se pudieron cargar los horarios disponibles. Por favor, intenta de nuevo.';
      }
    });
  }

  loadData(): void {
    this.dataService.getServices().subscribe({
      next: (services) => {
        this.services = services.filter(s => s.isActive);
      },
      error: (error) => console.error('Error loading services:', error)
    });

    this.dataService.getBarbers().subscribe({
      next: (barbers) => {
        this.barbers = barbers.filter(b => b.isActive);
      },
      error: (error) => console.error('Error loading barbers:', error)
    });
  }

  loadAppointments(): void {
    this.dataService.getMyAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        console.log('Citas cargadas:', appointments);
      },
      error: (error) => console.error('Error loading appointments:', error)
    });
  }

  selectService(service: Service): void {
    this.appointmentForm.patchValue({ serviceId: service.id });
    this.openAppointmentModal();
  }

  selectBarber(barber: Barber): void {
    this.appointmentForm.patchValue({ barberId: barber.userId });
    this.openAppointmentModal();
  }

  openAppointmentModal(): void {
    this.showAppointmentModal = true;
  }

  closeAppointmentModal(): void {
    this.showAppointmentModal = false;
    this.appointmentForm.reset();
    this.availableTimeSlots = [];
    this.isLoadingSlots = false;
    this.slotsLoadError = '';
    this.selectedBarberUnavailableMessage = '';
    this.allSlotsTaken = false;
  }

  onSubmitAppointment(appointmentData: any): void {
    console.log('DEBUG - Sending appointment data:', appointmentData);
    console.log('DEBUG - serviceId type:', typeof appointmentData.serviceId);
    console.log('DEBUG - barberId type:', typeof appointmentData.barberId);
    console.log('DEBUG - date:', appointmentData.date);
    console.log('DEBUG - time:', appointmentData.time);

    this.dataService.createAppointment(appointmentData).subscribe({
      next: (appointment) => {
        alert('¡Cita agendada exitosamente! El barbero confirmará tu cita pronto.');
        this.closeAppointmentModal();
        this.loadAppointments();
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
        alert('Error al agendar cita: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }

  cancelMyAppointment(appointmentId: number): void {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      this.dataService.cancelAppointment(appointmentId, 'Cancelada por el cliente').subscribe({
        next: () => {
          alert('Cita cancelada exitosamente!');
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          alert('Error al cancelar cita: ' + (error.error?.message || 'Error desconocido'));
        }
      });
    }
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


  setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  getRoleLabel(role: any): string {
    if (!role) return '';
    const labels: any = {
      'ADMIN': 'Administrador',
      'BARBER': 'Barbero',
      'CLIENT': 'Cliente'
    };
    return labels[role] || role;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
