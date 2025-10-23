import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Service, ServiceCategory } from '../models/service.model';
import { Barber, BarberSchedule, BarberException, UpdateBarberScheduleRequest, CreateBarberExceptionRequest } from '../models/barber.model';
import { Appointment, AppointmentStatus } from '../models/appointment.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Mock data para servicios (como fallback)
  private mockServices: Service[] = [
    {
      id: 1,
      name: 'Corte Clásico',
      description: 'Corte de cabello tradicional con tijeras y máquina',
      price: 15.00,
      duration: 30,
      category: ServiceCategory.HAIRCUT,
      isActive: true,
      image: '/assets/images/services/default.svg'
    },
    {
      id: 2,
      name: 'Corte y Barba',
      description: 'Corte de cabello completo más arreglo de barba',
      price: 25.00,
      duration: 45,
      category: ServiceCategory.BEARD,
      isActive: true,
      image: '/assets/images/services/default.svg'
    },
    {
      id: 3,
      name: 'Afeitado Clásico',
      description: 'Afeitado tradicional con navaja y toalla caliente',
      price: 20.00,
      duration: 35,
      category: ServiceCategory.BEARD,
      isActive: true,
      image: '/assets/images/services/default.svg'
    }
  ];

  // Mock data para barberos
  private mockBarbers: Barber[] = [
    {
      id: 1,
      userId: 2, // ID del usuario Miguel García
      name: 'Carlos Martínez',
      email: 'carlos@barbershop.com',
      phone: '+503 7000-0001',
      specialties: ['Cortes Clásicos', 'Barba', 'Afeitado'],
      rating: 4.8,
      experience: 8,
      isActive: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      schedule: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 2, startTime: '08:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '08:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '08:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '08:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 6, startTime: '09:00', endTime: '15:00', isAvailable: true }
      ]
    },
    {
      id: 2,
      userId: 3, // ID del usuario Carlos López
      name: 'Roberto García',
      email: 'roberto@barbershop.com',
      phone: '+503 7000-0002',
      specialties: ['Cortes Modernos', 'Styling', 'Tratamientos'],
      rating: 4.6,
      experience: 5,
      isActive: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      schedule: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isAvailable: true }
      ]
    }
  ];

  // === MÉTODOS PARA SERVICIOS ===
  getServices(): Observable<Service[]> {
    return this.http.get<any[]>(`${this.apiUrl}/public/services`)
      .pipe(
        map(services => services.map(service => this.mapBackendServiceToFrontend(service))),
        catchError(error => {
          console.error('Error fetching services:', error);
          return of(this.mockServices); // Fallback a datos mock
        })
      );
  }

  getServiceById(id: number): Observable<Service | undefined> {
    return this.http.get<any>(`${this.apiUrl}/public/services/${id}`)
      .pipe(
        map(service => this.mapBackendServiceToFrontend(service)),
        catchError(error => {
          console.error('Error fetching service:', error);
          return of(undefined);
        })
      );
  }

  createService(service: Partial<Service>): Observable<Service> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/admin/services`, service, { headers })
      .pipe(
        map(service => this.mapBackendServiceToFrontend(service)),
        catchError(error => {
          console.error('Error creating service:', error);
          throw error;
        })
      );
  }

  updateService(id: number, service: Partial<Service>): Observable<Service> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/admin/services/${id}`, service, { headers })
      .pipe(
        map(service => this.mapBackendServiceToFrontend(service)),
        catchError(error => {
          console.error('Error updating service:', error);
          throw error;
        })
      );
  }

  deleteService(id: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/admin/services/${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deleting service:', error);
          throw error;
        })
      );
  }

  activateService(id: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<void>(`${this.apiUrl}/admin/services/${id}/activate`, {}, { headers })
      .pipe(
        catchError(error => {
          console.error('Error activating service:', error);
          throw error;
        })
      );
  }

  deactivateService(id: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<void>(`${this.apiUrl}/admin/services/${id}/deactivate`, {}, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deactivating service:', error);
          throw error;
        })
      );
  }

  uploadServiceImage(formData: FormData): Observable<{url: string}> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // No establecer Content-Type - el navegador lo hace automáticamente para FormData
    return this.http.post<{url: string}>(`${this.apiUrl}/admin/upload/service-image`, formData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error uploading service image:', error);
          throw error;
        })
      );
  }

  // === MÉTODOS PARA BARBEROS ===
  getBarbers(): Observable<Barber[]> {
    return this.http.get<any[]>(`${this.apiUrl}/public/barbers`)
      .pipe(
        map(barbers => barbers.map(barber => this.mapBackendBarberToFrontend(barber))),
        catchError(error => {
          console.error('Error fetching barbers:', error);
          return of(this.mockBarbers); // Fallback a datos mock
        })
      );
  }

  getBarberById(id: number): Observable<Barber | undefined> {
    return this.http.get<any>(`${this.apiUrl}/public/barbers/${id}`)
      .pipe(
        map(barber => this.mapBackendBarberToFrontend(barber)),
        catchError(error => {
          console.error('Error fetching barber:', error);
          return of(undefined);
        })
      );
  }

  createBarber(barber: any): Observable<Barber> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/admin/barbers`, barber, { headers })
      .pipe(
        map(barber => this.mapBackendBarberToFrontend(barber)),
        catchError(error => {
          console.error('Error creating barber:', error);
          throw error;
        })
      );
  }

  updateBarber(id: number, barber: any): Observable<Barber> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/admin/barbers/${id}`, barber, { headers })
      .pipe(
        map(barber => this.mapBackendBarberToFrontend(barber)),
        catchError(error => {
          console.error('Error updating barber:', error);
          throw error;
        })
      );
  }

  deleteBarber(id: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/admin/barbers/${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deleting barber:', error);
          throw error;
        })
      );
  }

  deleteUser(id: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deleting user:', error);
          throw error;
        })
      );
  }

  // === MÉTODOS PARA GESTIÓN DE USUARIOS ===
  getUsers(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error getting users:', error);
          throw error;
        })
      );
  }

  createUser(user: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/admin/users`, user, { headers })
      .pipe(
        catchError(error => {
          console.error('Error creating user:', error);
          throw error;
        })
      );
  }

  updateUser(id: number, user: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/admin/users/${id}`, user, { headers })
      .pipe(
        catchError(error => {
          console.error('Error updating user:', error);
          throw error;
        })
      );
  }

  toggleUserStatus(id: number, activate: boolean): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    const endpoint = activate ? 'activate' : 'deactivate';
    return this.http.put<void>(`${this.apiUrl}/admin/users/${id}/${endpoint}`, {}, { headers })
      .pipe(
        catchError(error => {
          console.error(`Error ${activate ? 'activating' : 'deactivating'} user:`, error);
          throw error;
        })
      );
  }

  private mapBackendServiceToFrontend(backendService: any): Service {
    return {
      id: backendService.id,
      name: backendService.name,
      description: backendService.description,
      price: backendService.price,
      duration: backendService.duration,
      category: this.mapBackendCategoryToFrontend(backendService.category),
      isActive: backendService.isActive || backendService.active,
      image: backendService.image || '/assets/images/services/default.svg'
    };
  }

  private mapBackendBarberToFrontend(backendBarber: any): Barber {
    // Remove duplicate specialties using Set and ensure they are strings
    const uniqueSpecialties: string[] = backendBarber.specialties
      ? Array.from(new Set(backendBarber.specialties.map((s: any) => String(s))))
      : [];

    return {
      id: backendBarber.id,
      userId: backendBarber.userId,
      name: backendBarber.name,
      email: backendBarber.email,
      phone: backendBarber.phone,
      specialties: uniqueSpecialties,
      rating: backendBarber.rating || 0,
      experience: backendBarber.experience || 0,
      description: backendBarber.description || '',
      isActive: backendBarber.isActive || backendBarber.active,
      avatar: backendBarber.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      schedule: this.deduplicateSchedules(backendBarber.schedule || [])
    };
  }

  private deduplicateSchedules(schedules: any[]): any[] {
    const seen = new Set<string>();
    return schedules.filter(schedule => {
      const key = `${schedule.dayOfWeek}-${schedule.startTime}-${schedule.endTime}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private mapBackendCategoryToFrontend(backendCategory: string): ServiceCategory {
    const categoryMap: { [key: string]: ServiceCategory } = {
      'HAIRCUT': ServiceCategory.HAIRCUT,
      'BEARD': ServiceCategory.BEARD,
      'STYLING': ServiceCategory.STYLING,
      'TREATMENT': ServiceCategory.TREATMENT
    };
    return categoryMap[backendCategory] || ServiceCategory.HAIRCUT;
  }

  // Métodos para citas
  getMyAppointments(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/client/appointments`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error getting appointments:', error);
          return of([]);
        })
      );
  }

  createAppointment(appointment: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/client/appointments`, appointment, { headers })
      .pipe(
        catchError(error => {
          console.error('Error creating appointment:', error);
          throw error;
        })
      );
  }

  cancelAppointment(id: number, reason?: string): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return this.http.put<void>(`${this.apiUrl}/client/appointments/${id}/cancel${params}`, {}, { headers })
      .pipe(
        catchError(error => {
          console.error('Error cancelling appointment:', error);
          throw error;
        })
      );
  }

  // === MÉTODOS PARA BARBEROS ===
  getBarberAppointments(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/barber/appointments`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error getting barber appointments:', error);
          return of([]);
        })
      );
  }

  confirmAppointment(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/barber/appointments/${id}/confirm`, {}, { headers })
      .pipe(
        catchError(error => {
          console.error('Error confirming appointment:', error);
          throw error;
        })
      );
  }

  completeAppointment(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/barber/appointments/${id}/complete`, {}, { headers })
      .pipe(
        catchError(error => {
          console.error('Error completing appointment:', error);
          throw error;
        })
      );
  }

  cancelBarberAppointment(id: number, reason: string): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<void>(`${this.apiUrl}/barber/appointments/${id}/cancel?reason=${encodeURIComponent(reason)}`, {}, { headers })
      .pipe(
        catchError(error => {
          console.error('Error cancelling appointment:', error);
          throw error;
        })
      );
  }

  // ==================== SCHEDULE MANAGEMENT (ADMIN) ====================

  // Obtener horario semanal de un barbero
  getBarberSchedule(barberId: number): Observable<BarberSchedule[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<BarberSchedule[]>(`${this.apiUrl}/admin/barbers/${barberId}/schedule`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching barber schedule:', error);
          return of([]);
        })
      );
  }

  // Crear horario para un día específico
  createBarberSchedule(barberId: number, schedule: UpdateBarberScheduleRequest): Observable<BarberSchedule> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<BarberSchedule>(`${this.apiUrl}/admin/barbers/${barberId}/schedule`, schedule, { headers })
      .pipe(
        catchError(error => {
          console.error('Error creating barber schedule:', error);
          throw error;
        })
      );
  }

  // Actualizar todo el horario semanal de un barbero
  updateFullWeekSchedule(barberId: number, schedules: UpdateBarberScheduleRequest[]): Observable<BarberSchedule[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<BarberSchedule[]>(`${this.apiUrl}/admin/barbers/${barberId}/schedule`, schedules, { headers })
      .pipe(
        catchError(error => {
          console.error('Error updating week schedule:', error);
          throw error;
        })
      );
  }

  // Actualizar un horario específico
  updateBarberSchedule(scheduleId: number, schedule: UpdateBarberScheduleRequest): Observable<BarberSchedule> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<BarberSchedule>(`${this.apiUrl}/admin/schedule/${scheduleId}`, schedule, { headers })
      .pipe(
        catchError(error => {
          console.error('Error updating barber schedule:', error);
          throw error;
        })
      );
  }

  // Eliminar un horario específico
  deleteBarberSchedule(scheduleId: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/admin/schedule/${scheduleId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deleting barber schedule:', error);
          throw error;
        })
      );
  }

  // ==================== EXCEPTION MANAGEMENT (ADMIN) ====================

  // Obtener todas las excepciones de un barbero
  getBarberExceptions(barberId: number): Observable<BarberException[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<BarberException[]>(`${this.apiUrl}/admin/barbers/${barberId}/exceptions`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching barber exceptions:', error);
          return of([]);
        })
      );
  }

  // Obtener excepciones por rango de fechas
  getBarberExceptionsByDateRange(barberId: number, startDate: string, endDate: string): Observable<BarberException[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<BarberException[]>(
      `${this.apiUrl}/admin/barbers/${barberId}/exceptions/range?startDate=${startDate}&endDate=${endDate}`,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error fetching barber exceptions by date range:', error);
        return of([]);
      })
    );
  }

  // Crear una excepción (ausencia/cambio temporal)
  createBarberException(exception: CreateBarberExceptionRequest): Observable<BarberException> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<BarberException>(`${this.apiUrl}/admin/barbers/exceptions`, exception, { headers })
      .pipe(
        catchError(error => {
          console.error('Error creating barber exception:', error);
          throw error;
        })
      );
  }

  // Actualizar una excepción
  updateBarberException(exceptionId: number, exception: CreateBarberExceptionRequest): Observable<BarberException> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put<BarberException>(`${this.apiUrl}/admin/barbers/exceptions/${exceptionId}`, exception, { headers })
      .pipe(
        catchError(error => {
          console.error('Error updating barber exception:', error);
          throw error;
        })
      );
  }

  // Eliminar una excepción
  deleteBarberException(exceptionId: number): Observable<void> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/admin/barbers/exceptions/${exceptionId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deleting barber exception:', error);
          throw error;
        })
      );
  }

  // Verificar disponibilidad de un barbero
  checkBarberAvailability(barberId: number, date: string, time: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<any>(
      `${this.apiUrl}/admin/barbers/${barberId}/availability?date=${date}&time=${time}`,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error checking barber availability:', error);
        throw error;
      })
    );
  }

  // Obtener horarios disponibles para una fecha
  getAvailableTimeSlots(barberId: number, date: string): Observable<string[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<string[]>(
      `${this.apiUrl}/admin/barbers/${barberId}/available-slots?date=${date}`,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error fetching available time slots:', error);
        return of([]);
      })
    );
  }

  // ==================== SCHEDULE MANAGEMENT (BARBER - READ ONLY) ====================

  // Ver mi horario semanal (barbero)
  getMySchedule(): Observable<BarberSchedule[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<BarberSchedule[]>(`${this.apiUrl}/barber/schedule`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching my schedule:', error);
          return of([]);
        })
      );
  }

  // Ver mis excepciones (barbero)
  getMyExceptions(): Observable<BarberException[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<BarberException[]>(`${this.apiUrl}/barber/exceptions`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching my exceptions:', error);
          return of([]);
        })
      );
  }

  // Ver mis excepciones por rango de fechas (barbero)
  getMyExceptionsByDateRange(startDate: string, endDate: string): Observable<BarberException[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<BarberException[]>(
      `${this.apiUrl}/barber/exceptions/range?startDate=${startDate}&endDate=${endDate}`,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error fetching my exceptions by date range:', error);
        return of([]);
      })
    );
  }

  // Ver mis slots disponibles para una fecha (barbero)
  getMyAvailableTimeSlots(date: string): Observable<string[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<string[]>(
      `${this.apiUrl}/barber/available-slots?date=${date}`,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error fetching my available time slots:', error);
        return of([]);
      })
    );
  }
}