export interface Barber {
  id: number;
  userId: number; // ID del usuario (para crear citas)
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  specialties: string[];
  rating: number;
  experience: number; // años de experiencia
  description?: string;
  schedule?: BarberSchedule[];
  exceptions?: BarberException[];
  isActive?: boolean;
}

export interface BarberSchedule {
  id?: number;
  dayOfWeek: number; // 0 = domingo, 1 = lunes, etc.
  startTime: string; // formato HH:mm
  endTime: string;   // formato HH:mm
  isAvailable: boolean;
}

export interface BarberException {
  id?: number;
  barberProfileId: number;
  exceptionDate: string; // formato YYYY-MM-DD
  startTime?: string; // formato HH:mm (opcional si es todo el día)
  endTime?: string;   // formato HH:mm (opcional si es todo el día)
  isAvailable: boolean; // false = no disponible, true = disponible (sobrescribe horario)
  reason?: string; // Motivo: "Permiso", "Vacaciones", "Enfermedad", etc.
  allDay: boolean; // true = todo el día, false = solo el rango de horas
}

export interface BarberCreate {
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  experience: number;
}

export interface UpdateBarberScheduleRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface CreateBarberExceptionRequest {
  barberProfileId: number;
  exceptionDate: string;
  startTime?: string;
  endTime?: string;
  isAvailable: boolean;
  reason?: string;
  allDay: boolean;
}