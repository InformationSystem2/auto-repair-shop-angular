import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../models/offer.model';
import { Subscription, interval } from 'rxjs';
import { RequestInboxComponent } from './components/request-inbox/request-inbox';
import { RequestDetailsComponent } from './components/request-details/request-details';

@Component({
  selector: 'app-requests-page',
  standalone: true,
  imports: [CommonModule, RequestInboxComponent, RequestDetailsComponent],
  templateUrl: './request-page.html'
})
export class RequestsPageComponent implements OnInit, OnDestroy {
  offers: Offer[] = [];
  activeOffers: Offer[] = [];
  selectedOffer: Offer | null = null;
  isProcessing = false;
  activeTab: 'new' | 'active' = 'new';
  
  private pollSub: Subscription | null = null;

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.loadOffers();
    // Polling every 15 seconds to receive new offers
    this.pollSub = interval(15000).subscribe(() => {
      if (!this.isProcessing) {
         this.loadOffers(false);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
    }
  }

  handleTabChange(tab: 'new' | 'active'): void {
    this.activeTab = tab;
    this.selectedOffer = null;
    this.loadOffers(true);
  }

  loadOffers(showLoading: boolean = true): void {
    if (showLoading) this.isProcessing = true;

    const request$ = this.activeTab === 'new' 
      ? this.offerService.getMyOffers() 
      : this.offerService.getMyActiveOffers();

    request$.subscribe({
      next: (data) => {
        if (this.activeTab === 'new') this.offers = data;
        else this.activeOffers = data;
        
        this.isProcessing = false;
        
        if (this.selectedOffer) {
          const currentList = this.activeTab === 'new' ? this.offers : this.activeOffers;
          const stillExists = currentList.find(o => o.offer_id === this.selectedOffer!.offer_id);
          this.selectedOffer = stillExists || null;
        }
      },
      error: (err) => {
        console.error('Error loading offers', err);
        this.isProcessing = false;
      }
    });
  }

  handleSelectOffer(offer: Offer): void {
    this.selectedOffer = offer;
  }

  handleAcceptOffer(estimatedArrivalMin: number): void {
    if (!this.selectedOffer || this.isProcessing) return;
    this.isProcessing = true;

    this.offerService.acceptOffer(this.selectedOffer.offer_id, estimatedArrivalMin).subscribe({
      next: () => {
        this.selectedOffer = null;
        this.loadOffers();
      },
      error: () => {
        this.isProcessing = false;
        this.loadOffers();
      }
    });
  }

  handleRejectOffer(reason: string): void {
    if (!this.selectedOffer || this.isProcessing) return;
    this.isProcessing = true;

    this.offerService.rejectOffer(this.selectedOffer.offer_id, reason).subscribe({
      next: () => {
        this.selectedOffer = null;
        this.loadOffers();
      },
      error: (err) => {
        console.error(err);
        this.isProcessing = false;
        this.loadOffers();
      }
    });
  }

  handleCompleteOffer(): void {
    if (!this.selectedOffer || this.isProcessing) return;
    this.isProcessing = true;

    this.offerService.completeOffer(this.selectedOffer.offer_id).subscribe({
      next: () => {
        this.selectedOffer = null;
        this.loadOffers();
      },
      error: (err) => {
        console.error(err);
        this.isProcessing = false;
        this.loadOffers();
      }
    });
  }
}
