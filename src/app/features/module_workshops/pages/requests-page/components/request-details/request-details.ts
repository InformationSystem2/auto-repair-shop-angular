import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Offer } from '../../../../models/offer.model';
import { Technician } from '../../../../models/technician.model';
import { LeafletMapComponent } from '../../../../../../shared/components/leaflet-map/leaflet-map.component';
import { TranslationService } from '../../../../../../core/services/translation.service';
import { TechnicianService } from '../../../../services/technician.service';

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [CommonModule, FormsModule, LeafletMapComponent],
  templateUrl: './request-details.html'
})
export class RequestDetailsComponent implements OnChanges {
  public readonly i18n = inject(TranslationService);
  private readonly technicianService = inject(TechnicianService);
  
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

  // Técnicos disponibles
  availableTechnicians: Technician[] = [];
  selectedTechnicianId: string = '';
  loadingTechnicians = false;

  ngOnChanges(changes: SimpleChanges): void {
    // Al seleccionar una nueva oferta en la pestaña 'new', cargar técnicos disponibles
    if (changes['selectedOffer'] && this.selectedOffer && this.activeTab === 'new') {
      this.loadAvailableTechnicians();
    }
  }

  loadAvailableTechnicians(): void {
    this.loadingTechnicians = true;
    this.selectedTechnicianId = '';
    this.technicianService.getAvailable().subscribe({
      next: (techs) => {
        this.availableTechnicians = techs;
        if (techs.length > 0) {
          this.selectedTechnicianId = techs[0].id;
        }
        this.loadingTechnicians = false;
      },
      error: () => {
        this.availableTechnicians = [];
        this.loadingTechnicians = false;
      }
    });
  }

  togglePanel() {
    this.isExpanded = !this.isExpanded;
  }

  viewImage(url: string) {
    this.selectedImageUrl = url;
  }

  closeImage() {
    this.selectedImageUrl = null;
  }

  onAccept(): void {
    if (!this.selectedTechnicianId) return;
    this.accept.emit({
      estimatedArrivalMin: this.estimatedArrivalMin,
      technicianId: this.selectedTechnicianId
    });
  }

  onReject(): void {
    this.reject.emit(this.rejectionReason);
  }

  onComplete(): void {
    this.complete.emit(this.assignedCost);
  }
}
