import { Component, Input, OnChanges, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
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

  @ViewChild('mapEl', { static: true }) private readonly mapEl!: ElementRef<HTMLDivElement>;

  @Input() workshopLat!: number;
  @Input() workshopLng!: number;
  @Input() incidentLat!: number;
  @Input() incidentLng!: number;
  @Input() technicianLat?: number;
  @Input() technicianLng?: number;

  private map: L.Map | undefined;
  private workshopMarker: L.Marker | undefined;
  private incidentMarker: L.Marker | undefined;
  private technicianMarker: L.Marker | undefined;
  private routeLine: L.Polyline | undefined;

  private readonly workshopIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });

  private readonly incidentIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });

  private readonly technicianIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });

  ngAfterViewInit(): void {
    this.initMap();
    this.updateMap();
  }

  ngOnChanges(): void {
    if (this.map) {
      this.updateMap();
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapEl.nativeElement, {
      center: [this.workshopLat || 0, this.workshopLng || 0],
      zoom: 13,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private updateMap(): void {
    if (!this.map) return;

    if (this.workshopLat && this.workshopLng) {
      if (this.workshopMarker) {
        this.workshopMarker.setLatLng([this.workshopLat, this.workshopLng]);
      } else {
        this.workshopMarker = L.marker([this.workshopLat, this.workshopLng], { icon: this.workshopIcon })
          .addTo(this.map)
          .bindPopup(`<b>${this.i18n.translate('requests.map.my_workshop')}</b><br>${this.i18n.translate('requests.map.fixed_location')}`);
      }
    }

    if (this.incidentLat && this.incidentLng) {
      if (this.incidentMarker) {
        this.incidentMarker.setLatLng([this.incidentLat, this.incidentLng]);
      } else {
        this.incidentMarker = L.marker([this.incidentLat, this.incidentLng], { icon: this.incidentIcon })
          .addTo(this.map)
          .bindPopup(`<b>${this.i18n.translate('requests.map.client_location')}</b>`);
      }
    }

    if (this.technicianLat && this.technicianLng) {
      if (this.technicianMarker) {
        this.technicianMarker.setLatLng([this.technicianLat, this.technicianLng]);
      } else {
        this.technicianMarker = L.marker([this.technicianLat, this.technicianLng], { icon: this.technicianIcon })
          .addTo(this.map)
          .bindPopup('<b>🔧 Técnico en ruta</b>');
      }
    }

    // Draw routing polyline between Technician (or Workshop as fallback) and Client
    const originLat = this.technicianLat || this.workshopLat;
    const originLng = this.technicianLng || this.workshopLng;

    if (originLat && originLng && this.incidentLat && this.incidentLng) {
      const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${this.incidentLng},${this.incidentLat}?overview=full&geometries=geojson`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (!this.map) return;
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates as [number, number][];
            // OSRM returns coordinates as [lng, lat]
            const latLngs = coords.map(c => L.latLng(c[1], c[0]));

            if (this.routeLine) {
              this.routeLine.setLatLngs(latLngs);
            } else {
              this.routeLine = L.polyline(latLngs, {
                color: '#3B82F6',
                weight: 5,
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round'
              }).addTo(this.map);
            }
          }
        })
        .catch(err => console.error('Error fetching route from OSRM:', err));
    } else {
      if (this.routeLine && this.map) {
        this.routeLine.remove();
        this.routeLine = undefined;
      }
    }

    const markers = [this.workshopMarker, this.incidentMarker, this.technicianMarker]
      .filter((m): m is L.Marker => !!m);

    if (markers.length >= 2) {
      this.map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [50, 50] });
    } else if (markers.length === 1) {
      this.map.panTo(markers[0].getLatLng());
    }
  }
}
