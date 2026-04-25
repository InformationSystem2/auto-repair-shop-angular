export interface IncidentLocation {
  description: string;
  ai_category: string;
  ai_priority: string;
  ai_summary: string;
  latitude: number;
  longitude: number;
  evidence_urls?: string[];
  vertex_analysis?: any;
}

export interface WorkshopLocation {
    latitude: number;
    longitude: number;
}

export interface Offer {
  offer_id: string;
  incident_id: string;
  workshop_id: string;
  status: string;
  distance_km: number;
  ai_score: number;
  created_at: string;
  expires_at: string;
  expires_in_seconds: number;
  estimated_arrival_min?: number;
  incident: IncidentLocation;
  workshop?: WorkshopLocation;
}

export interface OfferResponse {
    offer_id: string;
    incident_id: string;
    workshop_id: string;
    status: string;
    message: string;
}
