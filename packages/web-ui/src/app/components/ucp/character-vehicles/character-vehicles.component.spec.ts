import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterVehiclesComponent } from './character-vehicles.component';

describe('CharacterVehiclesComponent', () => {
  let component: CharacterVehiclesComponent;
  let fixture: ComponentFixture<CharacterVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterVehiclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
