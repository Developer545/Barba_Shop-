export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  BARBER = 'barber',
  CLIENT = 'client'
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}