import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Service } from '../models/service.model';
import { Barber } from '../models/barber.model';

interface DaySlot {
  date: Date;
  day: string;
  dayNumber: number;
  isAvailable: boolean;
  slots: TimeSlot[];
  isDisabled: boolean;
}

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-appointment-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="w-full">
      <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
        <div class="space-y-4 sm:space-y-6">
          <!-- Service Selection -->
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              <span class="text-red-500">*</span> Servicio
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div *ngFor="let service of services"
                   (click)="appointmentForm.patchValue({ serviceId: service.id })"
                   [class.ring-2]="appointmentForm.get('serviceId')?.value === service.id"
                   [class.ring-indigo-600]="appointmentForm.get('serviceId')?.value === service.id"
                   [class.bg-indigo-50]="appointmentForm.get('serviceId')?.value === service.id"
                   class="p-3 sm:p-4 border-2 border-indigo-200 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 hover:border-indigo-400 hover:shadow-md">
                <p class="font-semibold text-gray-900 text-sm sm:text-base">{{ service.name }}</p>
                <p class="text-xs sm:text-sm text-gray-600 mt-1">\${{ service.price }} • {{ service.duration }} min</p>
              </div>
            </div>
          </div>

          <!-- Barber Selection -->
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              <span class="text-red-500">*</span> Barbero
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div *ngFor="let barber of barbers"
                   (click)="onBarberSelect(barber)"
                   [class.ring-2]="appointmentForm.get('barberId')?.value === barber.userId"
                   [class.ring-purple-600]="appointmentForm.get('barberId')?.value === barber.userId"
                   [class.bg-purple-50]="appointmentForm.get('barberId')?.value === barber.userId"
                   class="p-3 sm:p-4 border-2 border-purple-200 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 hover:border-purple-400 hover:shadow-md">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <img [src]="barber.avatar" [alt]="barber.name" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0">
                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-gray-900 text-sm sm:text-base truncate">{{ barber.name }}</p>
                    <p class="text-xs sm:text-sm text-yellow-500 font-semibold">★ {{ barber.rating }}/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Calendar & Time Selection -->
          <div *ngIf="appointmentForm.get('barberId')?.value">
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              <span class="text-red-500">*</span> Selecciona Fecha y Hora
            </label>

            <!-- Calendar View - Large & Prominent -->
            <div class="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-3 border-indigo-300 rounded-xl p-4 sm:p-8 shadow-lg">
              <!-- Calendar Header -->
              <div class="flex justify-between items-center mb-6 sm:mb-8 gap-2">
                <button type="button"
                        (click)="previousWeek()"
                        class="p-2 sm:p-3 hover:bg-indigo-200 rounded-lg transition-all duration-200 flex-shrink-0 hover:scale-110 transform">
                  <svg class="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <div class="text-center min-w-0 flex-1">
                  <p class="font-bold text-lg sm:text-2xl text-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    📅 {{ currentWeekStart | date:'MMMM':'' : 'es' }} {{ currentWeekStart | date:'yyyy' }}
                  </p>
                  <p class="text-xs sm:text-base text-indigo-600 font-semibold mt-1">
                    {{ currentWeekStart | date:'d' }} - {{ currentWeekEnd | date:'d MMMM':'' : 'es' }}
                  </p>
                </div>
                <button type="button"
                        (click)="nextWeek()"
                        class="p-2 sm:p-3 hover:bg-indigo-200 rounded-lg transition-all duration-200 flex-shrink-0 hover:scale-110 transform">
                  <svg class="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              <!-- Days of Week -->
              <div class="grid grid-cols-7 gap-2 sm:gap-3">
                <div *ngFor="let daySlot of weekDays"
                     (click)="selectDate(daySlot.date)"
                     [class.opacity-50]="daySlot.isDisabled"
                     [class.cursor-not-allowed]="daySlot.isDisabled"
                     [class.ring-4]="isSelectedDate(daySlot.date)"
                     [class.ring-indigo-600]="isSelectedDate(daySlot.date)"
                     [class.bg-gradient-to-br]="isSelectedDate(daySlot.date)"
                     [class.from-indigo-200]="isSelectedDate(daySlot.date)"
                     [class.to-indigo-100]="isSelectedDate(daySlot.date)"
                     [class.cursor-pointer]="!daySlot.isDisabled"
                     [class.hover:shadow-xl]="!daySlot.isDisabled"
                     class="p-3 sm:p-5 border-3 transition-all duration-200 rounded-xl text-center transform hover:scale-105"
                     [class.border-indigo-400]="!daySlot.isDisabled && isSelectedDate(daySlot.date)"
                     [class.border-green-400]="daySlot.isAvailable && !daySlot.isDisabled && !isSelectedDate(daySlot.date)"
                     [class.bg-green-50]="daySlot.isAvailable && !daySlot.isDisabled && !isSelectedDate(daySlot.date)"
                     [class.border-red-400]="!daySlot.isAvailable && !daySlot.isDisabled"
                     [class.bg-red-50]="!daySlot.isAvailable && !daySlot.isDisabled"
                     [class.border-gray-300]="daySlot.isDisabled"
                     [class.bg-gray-100]="daySlot.isDisabled">
                  <p class="text-xs sm:text-sm font-bold text-gray-600 uppercase">{{ daySlot.day }}</p>
                  <p class="text-2xl sm:text-4xl font-bold text-gray-900 my-2">{{ daySlot.dayNumber }}</p>
                  <div *ngIf="!daySlot.isDisabled" class="flex items-center justify-center space-x-1">
                    <span *ngIf="daySlot.isAvailable" class="text-xs sm:text-sm text-green-700 font-bold flex items-center bg-green-100 px-2 py-1 rounded-full">
                      ✓ {{ daySlot.slots.length }}
                    </span>
                    <span *ngIf="!daySlot.isAvailable" class="text-xs sm:text-sm text-red-700 font-bold bg-red-100 px-2 py-1 rounded-full">🔴 Lleno</span>
                  </div>
                </div>
              </div>

              <!-- Time Slots for Selected Date -->
              <div *ngIf="selectedDate">
                <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Horarios para {{ selectedDate | date:'d MMMM':'' : 'es' }}
                </label>

                <!-- Loading State -->
                <div *ngIf="isLoadingSlots" class="flex items-center justify-center py-6 sm:py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200">
                  <svg class="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-indigo-600 font-medium text-xs sm:text-base">Cargando horarios...</span>
                </div>

                <!-- Time Slots Grid -->
                <div *ngIf="!isLoadingSlots && availableTimeSlots.length > 0" class="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  <button *ngFor="let slot of availableTimeSlots"
                          type="button"
                          (click)="appointmentForm.patchValue({ time: slot })"
                          [class.ring-2]="appointmentForm.get('time')?.value === slot"
                          [class.ring-green-600]="appointmentForm.get('time')?.value === slot"
                          [class.bg-gradient-to-br]="appointmentForm.get('time')?.value === slot"
                          [class.from-green-400]="appointmentForm.get('time')?.value === slot"
                          [class.to-emerald-500]="appointmentForm.get('time')?.value === slot"
                          [class.text-white]="appointmentForm.get('time')?.value === slot"
                          [class.shadow-lg]="appointmentForm.get('time')?.value === slot"
                          [class.bg-white]="appointmentForm.get('time')?.value !== slot"
                          [class.text-indigo-600]="appointmentForm.get('time')?.value !== slot"
                          [class.border-2]="appointmentForm.get('time')?.value !== slot"
                          [class.border-indigo-200]="appointmentForm.get('time')?.value !== slot"
                          [class.hover:border-indigo-400]="appointmentForm.get('time')?.value !== slot"
                          [class.shadow-md]="appointmentForm.get('time')?.value !== slot"
                          class="py-2 sm:py-3 px-1.5 sm:px-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {{ slot }}
                  </button>
                </div>

                <!-- No Slots Available -->
                <div *ngIf="!isLoadingSlots && availableTimeSlots.length === 0" class="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-red-200">
                  <p class="text-red-600 font-medium text-center text-xs sm:text-sm">No hay horarios disponibles para esta fecha</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Notas adicionales (opcional)</label>
            <textarea formControlName="notes" rows="3"
                      class="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-indigo-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:border-indigo-300 transition-all duration-200 shadow-sm font-medium resize-none text-xs sm:text-sm"></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <button type="button"
                  (click)="cancel.emit()"
                  class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 text-gray-700 font-semibold rounded-lg sm:rounded-xl transition-all duration-200 shadow-md text-sm sm:text-base">
            Cancelar
          </button>
          <button type="submit"
                  [disabled]="!appointmentForm.valid || isLoadingSlots"
                  class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base">
            Confirmar Cita
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppointmentSchedulerComponent implements OnInit {
  @Input() services: Service[] = [];
  @Input() barbers: Barber[] = [];
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  appointmentForm: FormGroup;
  weekDays: DaySlot[] = [];
  currentWeekStart: Date = new Date();
  currentWeekEnd: Date = new Date();
  selectedDate: Date | null = null;
  availableTimeSlots: string[] = [];
  isLoadingSlots: boolean = false;

  constructor(
    private dataService: DataService,
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
    this.initializeCalendar();
  }

  initializeCalendar(): void {
    this.currentWeekStart = this.getStartOfWeek(new Date());
    this.currentWeekEnd = new Date(this.currentWeekStart);
    this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 6);
    this.loadWeekDays();
  }

  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  loadWeekDays(): void {
    this.weekDays = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(date.getDate() + i);

      const isDisabled = date < today;
      const dayNames = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

      this.weekDays.push({
        date: new Date(date),
        day: dayNames[date.getDay()],
        dayNumber: date.getDate(),
        isAvailable: true,
        slots: [],
        isDisabled: isDisabled
      });
    }
  }

  onBarberSelect(barber: Barber): void {
    this.appointmentForm.patchValue({ barberId: barber.userId });
    this.selectedDate = null;
    this.availableTimeSlots = [];
  }

  selectDate(date: Date): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return;
    }

    this.selectedDate = new Date(date);
    this.appointmentForm.patchValue({ date: this.formatDate(date) });
    this.loadTimeSlots();
  }

  loadTimeSlots(): void {
    if (!this.selectedDate || !this.appointmentForm.get('barberId')?.value) {
      return;
    }

    this.isLoadingSlots = true;
    const barberId = this.appointmentForm.get('barberId')?.value;
    const dateStr = this.formatDate(this.selectedDate);

    this.dataService.getAvailableTimeSlots(barberId, dateStr).subscribe({
      next: (slots) => {
        this.availableTimeSlots = slots;
        this.isLoadingSlots = false;
      },
      error: (error) => {
        console.error('Error loading time slots:', error);
        this.availableTimeSlots = [];
        this.isLoadingSlots = false;
      }
    });
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.loadWeekDays();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.loadWeekDays();
  }

  isSelectedDate(date: Date): boolean {
    if (!this.selectedDate) return false;
    return (
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      // Create a plain object with only primitive values to avoid NG02100 error
      const formValue = this.appointmentForm.value;
      const appointmentPayload = {
        serviceId: Number(formValue.serviceId),
        barberId: Number(formValue.barberId),
        date: String(formValue.date),
        time: String(formValue.time),
        notes: String(formValue.notes || '')
      };
      this.submit.emit(appointmentPayload);
    }
  }
}
