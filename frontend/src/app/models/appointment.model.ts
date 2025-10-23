export interface Appointment {
  id: number;
  clientId: number;
  barberId: number;
  serviceId: number;
  date: Date;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
  createdAt: Date;
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface AppointmentCreate {
  barberId: number;
  serviceId: number;
  date: string;
  time: string;
  notes?: string;
}