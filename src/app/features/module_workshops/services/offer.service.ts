import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer, OfferResponse } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = 'http://localhost:8000/api/offers';

  constructor(private http: HttpClient) {}

  getMyOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/my-offers`);
  }

  acceptOffer(offerId: string, estimatedArrivalMin: number, technicianId?: string): Observable<OfferResponse> {
    return this.http.post<OfferResponse>(`${this.apiUrl}/${offerId}/accept`, {
      estimated_arrival_min: estimatedArrivalMin,
      technician_id: technicianId
    });
  }

  rejectOffer(offerId: string, reason?: string): Observable<OfferResponse> {
    return this.http.post<OfferResponse>(`${this.apiUrl}/${offerId}/reject`, {
      rejection_reason: reason
    });
  }

  getMyActiveOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/my-active`);
  }

  completeOffer(offerId: string, cost?: number): Observable<OfferResponse> {
    return this.http.post<OfferResponse>(`${this.apiUrl}/${offerId}/complete`, {
      cost: cost
    });
  }
}
