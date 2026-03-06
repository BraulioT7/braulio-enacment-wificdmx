import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
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
  
  // Eventos hacia el padre
  closeSidebar = output<void>();
  focusPoint = output<WifiPoint>();

  removeFavorite(point: WifiPoint, event: Event): void {
    event.stopPropagation(); // Evita que se dispare el clic del contenedor
    this.favoritesService.toggleFavorite(point);
  }

  onSelectPoint(point: WifiPoint): void {
    this.focusPoint.emit(point);
  }
}