import { Specialty } from './specialty.model';

export interface Workshop {
  id: string;
  name: string;
  business_name: string;
  ruc_nit: string;
  address: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  is_available: boolean;
  is_verified: boolean;
  commission_rate: number;
  rating_avg: number | null;
  total_services: number;
  created_at: string;
  updated_at: string;
  specialties: Specialty[];
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  technicians_count?: number;
}

export interface WorkshopRegisterPublic {
  name: string;
  business_name: string;
  ruc_nit: string;
  address: string;
  phone: string;
  email: string;
  latitude?: number | null;
  longitude?: number | null;
  owner_name: string;
  owner_last_name: string;
  owner_phone: string;
  owner_password: string;
}

export interface WorkshopUpdate {
  name?: string;
  business_name?: string;
  address?: string;
  phone?: string;
  latitude?: number | null;
  longitude?: number | null;
  specialty_ids?: string[];
}

export interface WorkshopAdminUpdate extends WorkshopUpdate {
  is_available?: boolean;
  is_verified?: boolean;
  commission_rate?: number;
}
