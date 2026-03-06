import { Component, ChangeDetectionStrategy, inject, output, signal } from '@angular/core';
import { FavoritesService } from '../../../../core/services/favorites/favorites.service';
import { WifiPoint } from '../../../../shared/models/wifi-point.model';

@Component({
  selector: 'app-map-favorites-sidebar',
  standalone: true,
  templateUrl: './map-favorites-sidebar.component.html',
  styleUrl: './map-favorites-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapFavoritesSidebarComponent {
  private readonly favoritesService = inject(FavoritesService);

  // Exponemos el estado reactivo directamente a la vista
  favorites = this.favoritesService.favorites;

  pendingDeleteId = signal<string | null>(null);
  
  // Eventos hacia el padre
  closeSidebar = output<void>();
  focusPoint = output<WifiPoint>();

  requestDelete(pointId: string, event: Event): void {
    event.stopPropagation();
    this.pendingDeleteId.set(pointId);
  }

  cancelDelete(event: Event): void {
    event.stopPropagation();
    this.pendingDeleteId.set(null);
  }

  confirmDelete(point: WifiPoint, event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(point);
    this.pendingDeleteId.set(null);
  }

  /*
  removeFavorite(point: WifiPoint, event: Event): void {
    event.stopPropagation(); // Evita que se dispare el clic del contenedor
    this.favoritesService.toggleFavorite(point);
  }
    */

  onSelectPoint(point: WifiPoint): void {
    this.focusPoint.emit(point);
  }
}