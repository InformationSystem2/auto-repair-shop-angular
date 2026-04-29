import {
  Component, Input, Output, EventEmitter,
  inject, OnChanges, SimpleChanges, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Offer } from '../../../../models/offer.model';
import { Technician } from '../../../../models/technician.model';
import { LeafletMapComponent } from '../../../../../../shared/components/leaflet-map/leaflet-map.component';
import { TranslationService } from '../../../../../../core/services/translation.service';
import { TechnicianService } from '../../../../services/technician.service';
import { LocationTrackingService } from '../../../../../../core/services/location-tracking.service';

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [CommonModule, FormsModule, LeafletMapComponent],
  templateUrl: './request-details.html'
})
export class RequestDetailsComponent implements OnChanges, OnDestroy {
  public readonly i18n = inject(TranslationService);
  private readonly technicianService = inject(TechnicianService);
  private readonly locationTracking = inject(LocationTrackingService);

  @Input() selectedOffer: Offer | null = null;
  @Input() isProcessing = false;
  @Input() activeTab: 'new' | 'active' = 'new';

  @Output() accept = new EventEmitter<{ estimatedArrivalMin: number; technicianId: string }>();
  @Output() reject = new EventEmitter<string>();
  @Output() complete = new EventEmitter<number | undefined>();

  estimatedArrivalMin = 30;
  rejectionReason = 'busy';
  isExpanded = true;
  selectedImageUrl: string | null = null;
  assignedCost: number = 0;

  availableTechnicians: Technician[] = [];
  selectedTechnicianId: string = '';
  loadingTechnicians = false;

  // Live location state
  technicianLat: number | undefined;
  technicianLng: number | undefined;
  technicianName: string | null = null;
  trackingConnected = false;

  private locationSub: Subscription | null = null;
  private statusSub: Subscription | null = null;
  private currentTrackingIncidentId: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOffer'] && this.selectedOffer && this.activeTab === 'new') {
      this.loadAvailableTechnicians();
    }

    const offerChanged = changes['selectedOffer'];
    const tabChanged = changes['activeTab'];

    if (offerChanged || tabChanged) {
      if (this.activeTab === 'active' && this.selectedOffer) {
        const incidentId = this.selectedOffer.incident_id;
        if (incidentId !== this.currentTrackingIncidentId) {
          this._connectTracking(incidentId);
        }
      } else {
        this._disconnectTracking();
      }
    }
  }

  ngOnDestroy(): void {
    this._disconnectTracking();
  }

  private _connectTracking(incidentId: string): void {
    this._disconnectTracking();
    this.currentTrackingIncidentId = incidentId;
    this.technicianLat = undefined;
    this.technicianLng = undefined;
    this.technicianName = null;
    this.trackingConnected = false;

    this.locationSub = this.locationTracking.locationUpdates$.subscribe(update => {
      this.technicianLat = update.lat;
      this.technicianLng = update.lng;
      this.technicianName = update.technicianName;
    });

    this.statusSub = this.locationTracking.connectionStatus$.subscribe(status => {
      this.trackingConnected = status === 'connected';
    });

    this.locationTracking.connectAsViewer(incidentId);
  }

  private _disconnectTracking(): void {
    this.locationSub?.unsubscribe();
    this.statusSub?.unsubscribe();
    this.locationSub = null;
    this.statusSub = null;
    this.locationTracking.disconnect();
    this.trackingConnected = false;
    this.currentTrackingIncidentId = null;
  }

  loadAvailableTechnicians(): void {
    this.loadingTechnicians = true;
    this.selectedTechnicianId = '';
    this.technicianService.getAvailable().subscribe({
      next: (techs) => {
        this.availableTechnicians = techs;
        if (techs.length > 0) this.selectedTechnicianId = techs[0].id;
        this.loadingTechnicians = false;
      },
      error: () => {
        this.availableTechnicians = [];
        this.loadingTechnicians = false;
      }
    });
  }

  togglePanel() { this.isExpanded = !this.isExpanded; }
  viewImage(url: string) { this.selectedImageUrl = url; }
  closeImage() { this.selectedImageUrl = null; }

  onAccept(): void {
    if (!this.selectedTechnicianId) return;
    this.accept.emit({ estimatedArrivalMin: this.estimatedArrivalMin, technicianId: this.selectedTechnicianId });
  }

  onReject(): void { this.reject.emit(this.rejectionReason); }
  onComplete(): void { this.complete.emit(this.assignedCost); }
}
