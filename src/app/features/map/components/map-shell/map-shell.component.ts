import { Component, ChangeDetectionStrategy, inject, OnInit, NgZone, DestroyRef, AfterViewInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WifiService } from '../../../../core/services/wifi/wifi.service';
import { WifiPoint } from '../../../../shared/models/wifi-point.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-shell',
  standalone: true,
  imports: [],
  templateUrl: './map-shell.component.html',
  styleUrl: './map-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapShellComponent  implements AfterViewInit{
  private readonly wifiService = inject(WifiService);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef); // Destrucción automática de suscripciones

  private map!: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
    this.loadWifiPoints();
  }

  private initMap(): void {
    // Escapamos de la zona de Angular para instanciar el mapa
    this.zone.runOutsideAngular(() => {
      // Coordenadas centrales aproximadas de CDMX
      this.map = L.map('wifi-map').setView([19.432608, -99.133209], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    });
  }

  private loadWifiPoints(): void {
    this.wifiService.getWifiPoints()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        // TypeScript inferirá automáticamente que 'points' es WifiPoint[] gracias al servicio
        next: (points) => this.renderMarkers(points),
        error: (err) => console.error('Error al cargar puntos Wi-Fi', err)
      });
  }

  private renderMarkers(points: WifiPoint[]): void {
    // Dibujar marcadores también fuera de la zona de Angular para máximo rendimiento
    this.zone.runOutsideAngular(() => {
      points.forEach(point => {
        L.marker([point.latitud, point.longitud])
          .bindPopup(`<b>Programa:</b> ${point.programa}<br><b>Alcaldía:</b> ${point.alcaldia}`)
          .addTo(this.map);
      });
    });
  }
}

// Corrección de iconos de Leaflet en Angular
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;
