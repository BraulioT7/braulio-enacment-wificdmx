import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-map-filters',
  standalone: true,
  templateUrl: './map-filters.component.html',
  styleUrl: './map-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapFiltersComponent {
  alcaldias = input.required<string[]>();
  filterChanged = output<string>();

  onSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filterChanged.emit(target.value);
  }
}