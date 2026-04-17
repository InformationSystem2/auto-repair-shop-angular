import { Specialty } from './specialty.model';

export interface Technician {
  id: string;
  username: string;
  name: string;
  last_name: string;
  email: string;
  phone: string | null;
  is_available: boolean;
  current_latitude: number | null;
  current_longitude: number | null;
  workshop_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TechnicianCreate {
  name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string | null;
  is_available: boolean;
}

export interface TechnicianUpdate {
  name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  is_available?: boolean | null;
}
