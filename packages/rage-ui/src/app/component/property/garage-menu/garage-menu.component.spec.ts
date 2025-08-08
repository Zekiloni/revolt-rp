import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GarageMenuComponent } from './garage-menu.component';

describe('GarageMenuComponent', () => {
  let component: GarageMenuComponent;
  let fixture: ComponentFixture<GarageMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarageMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GarageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
