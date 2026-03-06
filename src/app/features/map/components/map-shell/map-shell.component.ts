import { Component, ChangeDetectionStrategy, inject, OnInit, NgZone, DestroyRef, AfterViewInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WifiService } from '../../../../core/services/wifi/wifi.service';
import { WifiPoint } from '../../../../shared/models/wifi-point.model';
import * as L from 'leaflet';
import { MapFiltersComponent } from '../map-filters/map-filters.component';
import { LocationService } from '../../../../core/services/location/location.service';

@Component({
  selector: 'app-map-shell',
  standalone: true,
  imports: [MapFiltersComponent],
  templateUrl: './map-shell.component.html',
  styleUrl: './map-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapShellComponent  implements AfterViewInit{
  private readonly wifiService = inject(WifiService);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef); // Destrucción automática de suscripciones
  private readonly locationService = inject(LocationService);

  private map!: L.Map;
  private markerGroup!: L.LayerGroup;
  private currentFilter = 'ALL'; // Rastro de filtros

  private allWifiPoints: WifiPoint[] = [];
  availableAlcaldias = signal<string[]>([]);

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

      // Inicializamos el grupo de capas y lo añadimos al mapa
      this.markerGroup = L.layerGroup().addTo(this.map);
    });
  }

  private loadWifiPoints(): void {
    this.wifiService.getWifiPoints()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (points: WifiPoint[]) => {
          this.allWifiPoints = points;
          this.extractAlcaldias(points);
          this.renderMarkers(points);
        },
        error: (err) => console.error('Error al cargar puntos Wi-Fi', err)
      });
  }

  private extractAlcaldias(points: WifiPoint[]): void {
    const uniqueAlcaldias = Array.from(new Set(points.map(p => p.alcaldia))).sort();
    this.availableAlcaldias.set(uniqueAlcaldias);
  }

  onFilterChanged(selectedAlcaldia: string): void {
    if (selectedAlcaldia === 'ALL') {
      this.renderMarkers(this.allWifiPoints);
    } else {
      const filtered = this.allWifiPoints.filter(p => p.alcaldia === selectedAlcaldia);
      this.renderMarkers(filtered);
    }
  }

  findNearest(): void {
    this.locationService.getUserLocation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (coords) => {
          // 1. Mostrar al usuario en el mapa y centrar la cámara
          this.zone.runOutsideAngular(() => {
            L.circleMarker([coords.latitude, coords.longitude], { color: 'red', radius: 8 })
              .bindPopup('<b>Tu ubicación actual</b>')
              .addTo(this.map);
            
            this.map.flyTo([coords.latitude, coords.longitude], 13);
          });

          // 2. Calcular el score (distancia en km) para TODOS los puntos
          this.allWifiPoints = this.allWifiPoints.map(point => ({
            ...point,
            score: this.locationService.calculateDistance(
              coords.latitude, coords.longitude, 
              point.latitud, point.longitud
            )
          }));

          // 3. Redibujar respetando el filtro que el usuario tenga activo
          this.applyCurrentState();
        },
        error: (err) => {
          // Manejo de estado de error claro
          alert('Permiso denegado o error de GPS. No se puede calcular la distancia.');
          console.error(err);
        }
      });
  }

  // Método auxiliar para centralizar la lógica de redibujado
  private applyCurrentState(): void {
    if (this.currentFilter === 'ALL') {
      this.renderMarkers(this.allWifiPoints);
    } else {
      const filtered = this.allWifiPoints.filter(p => p.alcaldia === this.currentFilter);
      this.renderMarkers(filtered);
    }
  }

  private renderMarkers(points: WifiPoint[]): void {
    // Dibujar marcadores también fuera de la zona de Angular para máximo rendimiento
    this.zone.runOutsideAngular(() => {

      this.markerGroup.clearLayers(); // Se limpia el mapa antes de redibujar
      points.forEach(point => {

        //Si ya el score se calculó, se renderiza
        const scoreHtml = point.score !== undefined ? `<br><b>Distancia:</b> ${point.score} km` : '';

        L.marker([point.latitud, point.longitud])
          .bindPopup(`<b>Programa:</b> ${point.programa}<br><b>Alcaldía:</b> ${point.alcaldia}${scoreHtml}`)
          .addTo(this.markerGroup);
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
