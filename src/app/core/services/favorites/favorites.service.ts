import { Injectable, signal } from '@angular/core';
import { WifiPoint } from '../../../shared/models/wifi-point.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'wifi_cdmx_favorites';
  
  // Estado reactivo: inicializa leyendo el storage
  favorites = signal<WifiPoint[]>(this.loadFromStorage());

  toggleFavorite(point: WifiPoint): void {
    const currentFavs = this.favorites();
    const isAlreadyFav = currentFavs.some(p => p.id === point.id);
    
    let updatedFavs: WifiPoint[];
    if (isAlreadyFav) {
      // Remover
      updatedFavs = currentFavs.filter(p => p.id !== point.id);
    } else {
      // Agregar
      updatedFavs = [...currentFavs, point];
    }
    
    this.favorites.set(updatedFavs);
    this.saveToStorage(updatedFavs);
  }

  isFavorite(id: string): boolean {
    return this.favorites().some(p => p.id === id);
  }

  // Aislamiento de la API del navegador
  private loadFromStorage(): WifiPoint[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error al leer localStorage', e);
      return [];
    }
  }

  private saveToStorage(data: WifiPoint[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error al guardar en localStorage', e);
    }
  }
}