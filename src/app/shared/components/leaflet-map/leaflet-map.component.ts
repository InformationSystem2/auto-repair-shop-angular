import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaflet-map.component.html'
})
export class LeafletMapComponent implements OnChanges, AfterViewInit {
  private readonly i18n = inject(TranslationService);
  
  @Input() workshopLat!: number;
  @Input() workshopLng!: number;
  
  @Input() incidentLat!: number;
  @Input() incidentLng!: number;

  private map: L.Map | undefined;
  private workshopMarker: L.Marker | undefined;
  private incidentMarker: L.Marker | undefined;

  // Custom marker configuration since default leaflet markers can fail to load icons in Angular
  private defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  private incidentIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  ngAfterViewInit(): void {
    this.initMap();
    this.updateMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map) {
      this.updateMap();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.workshopLat || 0, this.workshopLng || 0],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private updateMap(): void {
    if (!this.map) return;

    // Workshop Marker
    if (this.workshopLat && this.workshopLng) {
      if (this.workshopMarker) {
        this.workshopMarker.setLatLng([this.workshopLat, this.workshopLng]);
      } else {
        this.workshopMarker = L.marker([this.workshopLat, this.workshopLng], { icon: this.defaultIcon })
          .addTo(this.map)
          .bindPopup(`<b>${this.i18n.translate('requests.map.my_workshop')}</b><br>${this.i18n.translate('requests.map.fixed_location')}`);
      }
    }

    // Incident Marker
    if (this.incidentLat && this.incidentLng) {
      if (this.incidentMarker) {
        this.incidentMarker.setLatLng([this.incidentLat, this.incidentLng]);
      } else {
        this.incidentMarker = L.marker([this.incidentLat, this.incidentLng], { icon: this.incidentIcon })
          .addTo(this.map)
          .bindPopup(`<b>${this.i18n.translate('requests.map.client_location')}</b>`);
      }
    }

    // Fit bounds to show both markers if both exist
    if (this.workshopLat && this.incidentLat) {
      const group = L.featureGroup([this.workshopMarker as L.Marker, this.incidentMarker as L.Marker]);
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    } else if (this.workshopLat) {
       this.map.panTo([this.workshopLat, this.workshopLng]);
    }
  }
}
