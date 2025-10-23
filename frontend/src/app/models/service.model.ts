export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number; // en minutos
  image?: string;
  category?: ServiceCategory;
  isActive?: boolean;
}

export enum ServiceCategory {
  HAIRCUT = 'HAIRCUT',
  BEARD = 'BEARD',
  STYLING = 'STYLING',
  TREATMENT = 'TREATMENT'
}

export interface ServiceCreate {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: ServiceCategory;
}