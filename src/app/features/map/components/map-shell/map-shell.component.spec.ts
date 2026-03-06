import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapShellComponent } from './map-shell.component';

describe('MapShellComponent', () => {
  let component: MapShellComponent;
  let fixture: ComponentFixture<MapShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
