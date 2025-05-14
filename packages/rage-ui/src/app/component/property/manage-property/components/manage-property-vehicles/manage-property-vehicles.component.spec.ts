import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagePropertyVehiclesComponent } from './manage-property-vehicles.component';

describe('ManagePropertyVehiclesComponent', () => {
  let component: ManagePropertyVehiclesComponent;
  let fixture: ComponentFixture<ManagePropertyVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePropertyVehiclesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagePropertyVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
