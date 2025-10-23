import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarEvent {
  dateString: string; // YYYY-MM-DD format
  time: string;
  barberName: string;
  serviceName: string;
  status: string;
  id: number;
}

interface CalendarDay {
  dateString: string; // YYYY-MM-DD format
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: CalendarEvent[];
}

@Component({
  selector: 'app-appointments-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white rounded-2xl shadow-lg border border-indigo-100 p-6">
      <!-- Calendar Header -->
      <div class="flex justify-between items-center mb-6">
        <button (click)="previousMonth()"
                class="p-2 hover:bg-indigo-100 rounded-lg transition-all duration-200">
          <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900">
            {{ currentDate | date:'MMMM':'' : 'es' }}
          </h3>
          <p class="text-sm text-gray-600">{{ currentDate | date:'yyyy' }}</p>
        </div>

        <button (click)="nextMonth()"
                class="p-2 hover:bg-indigo-100 rounded-lg transition-all duration-200">
          <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div *ngFor="let day of weekDays"
             class="text-center font-semibold text-gray-600 text-sm py-2 uppercase">
          {{ day }}
        </div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-2">
        <div *ngFor="let day of calendarDays"
             [class.opacity-40]="!day.isCurrentMonth"
             [class.bg-indigo-50]="day.isToday"
             [class.ring-2]="day.isToday"
             [class.ring-indigo-500]="day.isToday"
             class="min-h-24 p-2 border-2 border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md hover:border-indigo-300"
             [class.bg-white]="!day.isToday">

          <!-- Day Number -->
          <div class="flex justify-between items-start mb-2">
            <span [class]="day.isToday ? 'text-indigo-600 font-bold' : 'text-gray-700 font-semibold'">
              {{ day.day }}
            </span>
            <span *ngIf="day.appointments.length > 0"
                  class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-2 py-1 rounded-full font-bold">
              {{ day.appointments.length }}
            </span>
          </div>

          <!-- Appointments for this day -->
          <div class="space-y-1">
            <div *ngFor="let appointment of day.appointments"
                 [class]="getAppointmentClass(appointment.status)"
                 class="text-xs p-1.5 rounded truncate font-semibold cursor-pointer hover:shadow-md transition-all duration-200"
                 [title]="appointment.serviceName + ' - ' + appointment.time">
              <span class="font-bold">{{ appointment.time }}</span>
              <br>
              <span class="text-xs opacity-90">{{ appointment.barberName }}</span>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="day.appointments.length === 0 && day.isCurrentMonth"
               class="text-gray-300 text-center text-xs py-2">
            <svg class="w-4 h-4 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <p class="text-sm font-semibold text-gray-700 mb-3">Estados:</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded"></div>
            <span class="text-xs text-gray-600">Pendiente</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded"></div>
            <span class="text-xs text-gray-600">Confirmada</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
            <span class="text-xs text-gray-600">Completada</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-600 rounded"></div>
            <span class="text-xs text-gray-600">Cancelada</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppointmentsCalendarComponent implements OnInit, OnChanges {
  @Input() appointments: any[] = [];

  currentDate: Date = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointments']) {
      this.generateCalendar();
    }
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarDays = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      this.calendarDays.push(this.createDayObject(new Date(year, month - 1, day), false));
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      this.calendarDays.push(this.createDayObject(new Date(year, month, day), true));
    }

    // Next month days
    const remainingDays = 42 - this.calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      this.calendarDays.push(this.createDayObject(new Date(year, month + 1, day), false));
    }
  }

  createDayObject(date: Date, isCurrentMonth: boolean): CalendarDay {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayToCheck = new Date(date);
    dayToCheck.setHours(0, 0, 0, 0);

    const isToday = dayToCheck.getTime() === today.getTime();
    const dateString = this.formatDateToString(date);

    // Get appointments for this day
    const dayAppointments = this.appointments
      .filter(apt => {
        const aptDateString = this.normalizeDateString(apt.date);
        return aptDateString === dateString;
      })
      .map(apt => ({
        dateString: this.normalizeDateString(apt.date),
        time: apt.time || 'TBD',
        barberName: apt.barberName || 'Barbero',
        serviceName: apt.serviceName || 'Servicio',
        status: (apt.status || apt.appointmentStatus || 'PENDING').toUpperCase(),
        id: apt.id
      }));

    return {
      dateString: dateString,
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      isCurrentMonth,
      isToday,
      appointments: dayAppointments
    };
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private normalizeDateString(dateValue: any): string {
    if (typeof dateValue === 'string') {
      // Extract just the date part if it's an ISO string
      return dateValue.split('T')[0];
    } else if (dateValue instanceof Date) {
      return this.formatDateToString(dateValue);
    }
    return '';
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  getAppointmentClass(status: string): string {
    const normalizedStatus = status ? status.toUpperCase() : 'PENDING';
    const classes: { [key: string]: string } = {
      'PENDING': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
      'CONFIRMED': 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
      'COMPLETED': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
      'CANCELLED': 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
    };
    return classes[normalizedStatus] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
  }
}
