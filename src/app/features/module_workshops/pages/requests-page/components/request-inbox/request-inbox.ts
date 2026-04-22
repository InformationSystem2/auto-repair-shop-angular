import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer } from '../../../../models/offer.model';
import { TranslationService } from '../../../../../../core/services/translation.service';

@Component({
  selector: 'app-request-inbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-inbox.html'
})
export class RequestInboxComponent {
  public readonly i18n = inject(TranslationService);
  
  @Input() offers: Offer[] = [];
  @Input() selectedOffer: Offer | null = null;
  @Input() isProcessing = false;
  @Input() activeTab: 'new' | 'active' = 'new';
  
  @Output() select = new EventEmitter<Offer>();
  @Output() refresh = new EventEmitter<void>();
  @Output() tabChange = new EventEmitter<'new' | 'active'>();

  setTab(tab: 'new' | 'active') {
    this.tabChange.emit(tab);
  }

  onSelect(offer: Offer): void {
    this.select.emit(offer);
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  getSeverityClasses(priority: string): string {
    switch(priority?.toUpperCase()) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      case 'HIGH': return 'bg-orange-500/10 text-orange-600 border border-orange-500/20';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      default: return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
    }
  }

  getSeverityDot(priority: string): string {
    switch(priority?.toUpperCase()) {
      case 'CRITICAL': return 'bg-rose-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  }
}
