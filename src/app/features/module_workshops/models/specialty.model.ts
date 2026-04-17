export interface Specialty {
  id: string;
  name: string;
  description?: string;
}

export interface SpecialtyCreate {
  name: string;
  description?: string;
}

export interface SpecialtyUpdate {
  name: string;
  description?: string;
}
