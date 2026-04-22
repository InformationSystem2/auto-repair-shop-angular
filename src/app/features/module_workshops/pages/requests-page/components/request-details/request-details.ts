import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Offer } from '../../../../models/offer.model';
import { LeafletMapComponent } from '../../../../../../shared/components/leaflet-map/leaflet-map.component';
import { TranslationService } from '../../../../../../core/services/translation.service';

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [CommonModule, FormsModule, LeafletMapComponent],
  templateUrl: './request-details.html'
})
export class RequestDetailsComponent {
  public readonly i18n = inject(TranslationService);
  
  @Input() selectedOffer: Offer | null = null;
  @Input() isProcessing = false;
  @Input() activeTab: 'new' | 'active' = 'new';
  
  @Output() accept = new EventEmitter<number>();
  @Output() reject = new EventEmitter<string>();
  @Output() complete = new EventEmitter<void>();

  estimatedArrivalMin = 30;
  rejectionReason = 'busy';
  isExpanded = true;
  selectedImageUrl: string | null = null;

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
    this.accept.emit(this.estimatedArrivalMin);
  }

  onReject(): void {
    this.reject.emit(this.rejectionReason);
  }

  onComplete(): void {
    this.complete.emit();
  }
}
