import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFavoritesSidebarComponent } from './map-favorites-sidebar.component';

describe('MapFavoritesSidebarComponent', () => {
  let component: MapFavoritesSidebarComponent;
  let fixture: ComponentFixture<MapFavoritesSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapFavoritesSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapFavoritesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
