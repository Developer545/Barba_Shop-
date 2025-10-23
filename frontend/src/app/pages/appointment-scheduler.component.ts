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
            <label class="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">
              <span class="text-red-500">*</span> 📅 Selecciona Fecha y Hora
            </label>

            <!-- Google Calendar Style -->
            <div class="bg-white border-2 border-indigo-200 rounded-xl shadow-lg overflow-hidden">
              <!-- Calendar Header -->
              <div class="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <button type="button"
                        (click)="previousMonth()"
                        class="p-2 hover:bg-indigo-500 rounded-lg transition-all duration-200 hover:scale-110">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <div class="text-center flex-1">
                  <p class="text-white font-bold text-lg sm:text-xl">
                    {{ currentMonth | date:'MMMM':'' : 'es' | uppercase }} {{ currentMonth | date:'yyyy' }}
                  </p>
                </div>
                <button type="button"
                        (click)="nextMonth()"
                        class="p-2 hover:bg-indigo-500 rounded-lg transition-all duration-200 hover:scale-110">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              <!-- Calendar Grid -->
              <div class="p-3 sm:p-4">
                <!-- Week Day Headers -->
                <div class="grid grid-cols-7 gap-2 mb-3 sm:mb-4">
                  <div *ngFor="let weekDay of weekDayHeaders" class="text-center font-bold text-gray-600 text-xs sm:text-sm py-2">
                    {{ weekDay }}
                  </div>
                </div>

                <!-- Days Grid -->
                <div class="grid grid-cols-7 gap-2">
                  <button *ngFor="let day of monthDays"
                          type="button"
                          (click)="selectDate(day.date)"
                          [disabled]="day.isDisabled"
                          [class.opacity-30]="day.isDisabled"
                          [class.cursor-not-allowed]="day.isDisabled"
                          [class.ring-4]="isSelectedDate(day.date)"
                          [class.ring-indigo-600]="isSelectedDate(day.date)"
                          [class.bg-gradient-to-br]="isSelectedDate(day.date)"
                          [class.from-indigo-500]="isSelectedDate(day.date)"
                          [class.to-blue-500]="isSelectedDate(day.date)"
                          [class.text-white]="isSelectedDate(day.date)"
                          [class.shadow-lg]="isSelectedDate(day.date)"
                          [class.bg-green-50]="!day.isDisabled && day.isAvailable && !isSelectedDate(day.date)"
                          [class.border-2]="!day.isDisabled && day.isAvailable && !isSelectedDate(day.date)"
                          [class.border-green-400]="!day.isDisabled && day.isAvailable && !isSelectedDate(day.date)"
                          [class.hover:bg-green-100]="!day.isDisabled && day.isAvailable && !isSelectedDate(day.date)"
                          [class.hover:shadow-md]="!day.isDisabled && !isSelectedDate(day.date)"
                          [class.bg-gray-50]="day.isDisabled"
                          class="aspect-square p-1 sm:p-2 border rounded-lg transition-all duration-200 flex flex-col items-center justify-center text-center hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed">
                    <span class="text-xs sm:text-sm font-semibold text-gray-700" [class.text-white]="isSelectedDate(day.date)">{{ day.dayNumber }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Time Slots for Selected Date -->
            <div *ngIf="selectedDate" class="mt-6">
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
  monthDays: DaySlot[] = [];
  currentMonth: Date = new Date();
  selectedDate: Date | null = null;
  availableTimeSlots: string[] = [];
  isLoadingSlots: boolean = false;
  weekDayHeaders = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

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
    this.currentMonth = new Date();
    this.loadMonthDays();
  }

  loadMonthDays(): void {
    this.monthDays = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    // First day of the month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add previous month's days (gray out)
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      this.monthDays.push({
        date: new Date(date),
        day: this.weekDayHeaders[date.getDay()],
        dayNumber: day,
        isAvailable: true,
        slots: [],
        isDisabled: true
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = date < today;

      this.monthDays.push({
        date: new Date(date),
        day: this.weekDayHeaders[date.getDay()],
        dayNumber: day,
        isAvailable: !isDisabled,
        slots: [],
        isDisabled: isDisabled
      });
    }

    // Add next month's days (gray out)
    const remainingDays = 42 - this.monthDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      this.monthDays.push({
        date: new Date(date),
        day: this.weekDayHeaders[date.getDay()],
        dayNumber: day,
        isAvailable: true,
        slots: [],
        isDisabled: true
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

  previousMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.loadMonthDays();
  }

  nextMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.loadMonthDays();
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
