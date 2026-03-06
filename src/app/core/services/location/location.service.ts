import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
// Se envuelve el callback nativo en un flujo reactivo estricto
  getUserLocation(): Observable<GeolocationCoordinates> {
    return new Observable<GeolocationCoordinates>(observer => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position.coords);
            observer.complete();
          },
          (error) => observer.error(error),
          { enableHighAccuracy: true }
        );
      } else {
        observer.error(new Error('Geolocalización no soportada por el navegador.'));
      }
    });
  }

  /**
   * Calcula la distancia entre dos coordenadas usando la fórmula de Haversine.
   * Retorna la distancia en kilómetros. Función pura.
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // 2 decimales para mayor limpieza visual
    return Math.round((R * c) * 100) / 100;
  }

  /**
   * Transforma una distancia en kilómetros en un score de 0 a 100.
   * Asume un radio de utilidad máximo de 5km en la ciudad.
   */
  calculateScore(distanceKm: number): number {
    const MAX_RADIUS = 5; 
    if (distanceKm >= MAX_RADIUS) return 0;
    
    // Regla de tres inversa: a menor distancia, mayor score
    return Math.round(100 - ((distanceKm / MAX_RADIUS) * 100));
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
