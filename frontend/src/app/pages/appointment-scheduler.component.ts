import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Service } from '../models/service.model';
import { Barber } from '../models/barber.model';

interface CalendarDay {
  dateString: string; // YYYY-MM-DD format
  dateObj: Date;
  dayNumber: number;
  dayName: string;
  isDisabled: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface TimeSlotUI {
  time: string; // HH:mm format
  isAvailable: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-appointment-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl p-4 sm:p-6 shadow-lg">
      <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
        <div class="space-y-6 sm:space-y-8">
          <!-- Step 1: Service Selection -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm">1</div>
              <label class="block text-sm font-bold text-gray-900">Selecciona Servicio</label>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div *ngFor="let service of services"
                   (click)="appointmentForm.patchValue({ serviceId: service.id })"
                   [class.ring-2]="appointmentForm.get('serviceId')?.value === service.id"
                   [class.ring-indigo-600]="appointmentForm.get('serviceId')?.value === service.id"
                   [class.bg-indigo-50]="appointmentForm.get('serviceId')?.value === service.id"
                   class="p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-indigo-400 hover:shadow-md">
                <p class="font-semibold text-gray-900 text-sm">{{ service.name }}</p>
                <p class="text-xs text-gray-600 mt-2">\${{ service.price }} • {{ service.duration }} min</p>
              </div>
            </div>
          </div>

          <!-- Step 2: Barber Selection -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm">2</div>
              <label class="block text-sm font-bold text-gray-900">Selecciona Barbero</label>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div *ngFor="let barber of barbers"
                   (click)="onBarberSelect(barber)"
                   [class.ring-2]="appointmentForm.get('barberId')?.value === barber.userId"
                   [class.ring-purple-600]="appointmentForm.get('barberId')?.value === barber.userId"
                   [class.bg-purple-50]="appointmentForm.get('barberId')?.value === barber.userId"
                   class="p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-purple-400 hover:shadow-md">
                <div class="flex items-center gap-3">
                  <img [src]="barber.avatar" [alt]="barber.name" class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0">
                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-gray-900 text-sm">{{ barber.name }}</p>
                    <p class="text-xs text-yellow-500 font-semibold">★ {{ barber.rating }}/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Date & Time Selection -->
          <div *ngIf="appointmentForm.get('barberId')?.value">
            <div class="flex items-center gap-2 mb-4">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm">3</div>
              <label class="block text-sm font-bold text-gray-900">Selecciona Fecha y Hora</label>
            </div>

            <!-- Google Calendar Style Month View -->
            <div class="bg-white border-2 border-indigo-200 rounded-xl shadow-lg overflow-hidden mb-6">
              <!-- Calendar Header -->
              <div class="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 sm:px-6 py-4 flex justify-between items-center">
                <button type="button"
                        (click)="previousMonth()"
                        class="p-2 hover:bg-indigo-500 rounded-lg transition-all hover:scale-110">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <div class="text-center flex-1">
                  <p class="text-white font-bold text-lg">
                    {{ getMonthName(currentMonth) | uppercase }} {{ currentMonth?.getFullYear() }}
                  </p>
                </div>
                <button type="button"
                        (click)="nextMonth()"
                        class="p-2 hover:bg-indigo-500 rounded-lg transition-all hover:scale-110">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              <!-- Calendar Grid -->
              <div class="p-4">
                <!-- Week Day Headers -->
                <div class="grid grid-cols-7 gap-2 mb-3">
                  <div *ngFor="let weekDay of weekDayHeaders" class="text-center font-bold text-gray-600 text-xs py-2">
                    {{ weekDay }}
                  </div>
                </div>

                <!-- Days Grid -->
                <div class="grid grid-cols-7 gap-2">
                  <button *ngFor="let day of calendarDays"
                          type="button"
                          (click)="selectDate(day.dateString)"
                          [disabled]="day.isDisabled"
                          [class.opacity-30]="day.isDisabled"
                          [class.cursor-not-allowed]="day.isDisabled"
                          [class.ring-4]="day.isSelected"
                          [class.ring-indigo-600]="day.isSelected"
                          [class.bg-gradient-to-br]="day.isSelected"
                          [class.from-indigo-500]="day.isSelected"
                          [class.to-blue-500]="day.isSelected"
                          [class.text-white]="day.isSelected"
                          [class.shadow-lg]="day.isSelected"
                          [class.bg-green-50]="!day.isDisabled && day.isSelected === false"
                          [class.border-2]="!day.isDisabled && day.isSelected === false"
                          [class.border-green-400]="!day.isDisabled && day.isSelected === false"
                          [class.hover:bg-green-100]="!day.isDisabled && day.isSelected === false"
                          [class.bg-gray-50]="day.isDisabled"
                          class="aspect-square p-2 border rounded-lg transition-all hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center">
                    <span class="text-sm font-semibold" [class.text-white]="day.isSelected">{{ day.dayNumber }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Time Slots Selection -->
            <div *ngIf="selectedDateString" class="bg-white border-2 border-green-200 rounded-xl p-4 sm:p-6 shadow-lg">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <p class="text-sm font-semibold text-gray-900">
                  Horarios disponibles para {{ formatDateForDisplay(selectedDateString) }}
                </p>
              </div>

              <!-- Loading State -->
              <div *ngIf="isLoadingSlots" class="flex items-center justify-center py-8 gap-3">
                <svg class="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-indigo-600 font-medium">Cargando horarios...</span>
              </div>

              <!-- Time Slots Grid -->
              <div *ngIf="!isLoadingSlots && timeSlots.length > 0" class="grid grid-cols-4 sm:grid-cols-6 gap-2">
                <button *ngFor="let slot of timeSlots"
                        type="button"
                        (click)="selectTime(slot.time)"
                        [disabled]="!slot.isAvailable"
                        [class.ring-2]="slot.isSelected"
                        [class.ring-green-600]="slot.isSelected"
                        [class.bg-gradient-to-br]="slot.isSelected"
                        [class.from-green-400]="slot.isSelected"
                        [class.to-emerald-500]="slot.isSelected"
                        [class.text-white]="slot.isSelected"
                        [class.shadow-lg]="slot.isSelected"
                        [class.bg-white]="!slot.isSelected && slot.isAvailable"
                        [class.border-2]="!slot.isSelected && slot.isAvailable"
                        [class.border-green-400]="!slot.isSelected && slot.isAvailable"
                        [class.text-green-700]="!slot.isSelected && slot.isAvailable"
                        [class.hover:bg-green-50]="!slot.isSelected && slot.isAvailable"
                        [class.bg-red-50]="!slot.isAvailable"
                        [class.border-2]="!slot.isAvailable"
                        [class.border-red-300]="!slot.isAvailable"
                        [class.text-red-500]="!slot.isAvailable"
                        [class.opacity-50]="!slot.isAvailable"
                        [class.cursor-not-allowed]="!slot.isAvailable"
                        class="py-3 px-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed">
                  {{ slot.time }}
                  <br>
                  <span class="text-xs" [class.text-white]="slot.isSelected">{{ slot.isAvailable ? '✓' : '✗' }}</span>
                </button>
              </div>

              <!-- No Slots Available -->
              <div *ngIf="!isLoadingSlots && timeSlots.length === 0" class="bg-red-50 rounded-lg p-4 border-2 border-red-200 text-center">
                <p class="text-red-600 font-medium">No hay horarios disponibles para esta fecha</p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Notas adicionales (opcional)</label>
            <textarea formControlName="notes" rows="3"
                      placeholder="Agrega cualquier nota especial para tu cita..."
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:border-indigo-300 transition-all shadow-sm resize-none text-sm"></textarea>
          </div>

          <!-- Summary -->
          <div *ngIf="appointmentForm.get('serviceId')?.value && appointmentForm.get('barberId')?.value && selectedDateString && appointmentForm.get('time')?.value"
               class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 space-y-2">
            <p class="text-sm text-gray-700"><span class="font-semibold">Servicio:</span> {{ getServiceName() }}</p>
            <p class="text-sm text-gray-700"><span class="font-semibold">Barbero:</span> {{ getBarberName() }}</p>
            <p class="text-sm text-gray-700"><span class="font-semibold">Fecha:</span> {{ formatDateFullForDisplay(selectedDateString) }}</p>
            <p class="text-sm text-gray-700"><span class="font-semibold">Hora:</span> {{ appointmentForm.get('time')?.value }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button type="button"
                  (click)="cancel.emit()"
                  class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all shadow-md">
            Cancelar
          </button>
          <button type="submit"
                  [disabled]="!appointmentForm.valid || isLoadingSlots"
                  class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            ✓ Confirmar Cita
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
export class AppointmentSchedulerComponent implements OnInit, OnChanges {
  @Input() services: Service[] = [];
  @Input() barbers: Barber[] = [];
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  appointmentForm: FormGroup;
  currentMonth: Date;
  calendarDays: CalendarDay[] = [];
  selectedDateString: string | null = null;
  timeSlots: TimeSlotUI[] = [];
  isLoadingSlots: boolean = false;
  weekDayHeaders = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    this.currentMonth = new Date();
    this.appointmentForm = this.fb.group({
      serviceId: ['', Validators.required],
      barberId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (!this.currentMonth || !(this.currentMonth instanceof Date)) {
      this.currentMonth = new Date();
    }
    this.generateCalendarDays();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['services'] || changes['barbers']) {
      this.generateCalendarDays();
    }
  }

  generateCalendarDays(): void {
    this.calendarDays = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      this.calendarDays.push({
        dateString: this.formatDateToString(date),
        dateObj: new Date(date),
        dayNumber: day,
        dayName: this.weekDayHeaders[date.getDay()],
        isDisabled: true,
        isToday: false,
        isSelected: false
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = date < today;
      const dateStr = this.formatDateToString(date);

      this.calendarDays.push({
        dateString: dateStr,
        dateObj: new Date(date),
        dayNumber: day,
        dayName: this.weekDayHeaders[date.getDay()],
        isDisabled: isDisabled,
        isToday: dateStr === this.formatDateToString(today),
        isSelected: dateStr === this.selectedDateString
      });
    }

    // Add next month's days
    const remainingDays = 42 - this.calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      this.calendarDays.push({
        dateString: this.formatDateToString(date),
        dateObj: new Date(date),
        dayNumber: day,
        dayName: this.weekDayHeaders[date.getDay()],
        isDisabled: true,
        isToday: false,
        isSelected: false
      });
    }

    // Update selected states
    this.calendarDays = this.calendarDays.map(day => ({
      ...day,
      isSelected: day.dateString === this.selectedDateString
    }));
  }

  selectDate(dateString: string): void {
    this.selectedDateString = dateString;
    this.appointmentForm.patchValue({ date: dateString });
    this.timeSlots = [];
    this.generateCalendarDays();
    this.loadTimeSlots();
  }

  onBarberSelect(barber: Barber): void {
    this.appointmentForm.patchValue({ barberId: barber.userId });
    this.selectedDateString = null;
    this.timeSlots = [];
    this.generateCalendarDays();
  }

  selectTime(time: string): void {
    this.appointmentForm.patchValue({ time: time });
    this.timeSlots = this.timeSlots.map(slot => ({
      ...slot,
      isSelected: slot.time === time
    }));
  }

  loadTimeSlots(): void {
    if (!this.selectedDateString || !this.appointmentForm.get('barberId')?.value) {
      return;
    }

    this.isLoadingSlots = true;
    const barberId = this.appointmentForm.get('barberId')?.value;

    this.dataService.getAvailableTimeSlots(barberId, this.selectedDateString).subscribe({
      next: (availableSlots) => {
        // Generate 15-minute slots for the entire day
        this.timeSlots = this.generateTimeSlots(availableSlots);
        this.isLoadingSlots = false;
      },
      error: (error) => {
        console.error('Error loading time slots:', error);
        this.timeSlots = [];
        this.isLoadingSlots = false;
      }
    });
  }

  generateTimeSlots(availableSlots: string[]): TimeSlotUI[] {
    // Generate slots from 8 AM to 6 PM, every 15 minutes
    const slots: TimeSlotUI[] = [];
    const startHour = 8;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const isAvailable = availableSlots.includes(time);
        slots.push({
          time,
          isAvailable,
          isSelected: time === this.appointmentForm.get('time')?.value
        });
      }
    }

    return slots;
  }

  previousMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.currentMonth = new Date(this.currentMonth);
    this.generateCalendarDays();
  }

  nextMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.currentMonth = new Date(this.currentMonth);
    this.generateCalendarDays();
  }

  formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getServiceName(): string {
    const serviceId = this.appointmentForm.get('serviceId')?.value;
    return this.services.find(s => s.id === serviceId)?.name || '';
  }

  getBarberName(): string {
    const barberId = this.appointmentForm.get('barberId')?.value;
    return this.barbers.find(b => b.userId === barberId)?.name || '';
  }

  formatDateForDisplay(dateString: string | null): string {
    if (!dateString) return '';
    // dateString format: YYYY-MM-DD
    const date = new Date(dateString + 'T00:00:00');
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} de ${month}`;
  }

  formatDateFullForDisplay(dateString: string | null): string {
    if (!dateString) return '';
    // dateString format: YYYY-MM-DD
    const date = new Date(dateString + 'T00:00:00');
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  }

  getMonthName(date: Date | null | undefined): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return months[date.getMonth()] || '';
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const payload = {
        serviceId: Number(formValue.serviceId),
        barberId: Number(formValue.barberId),
        date: String(formValue.date),
        time: String(formValue.time),
        notes: String(formValue.notes || '')
      };
      this.submit.emit(payload);
    }
  }
}
