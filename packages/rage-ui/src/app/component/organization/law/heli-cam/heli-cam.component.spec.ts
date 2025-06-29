import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeliCamComponent } from './heli-cam.component';

describe('HeliCamComponent', () => {
  let component: HeliCamComponent;
  let fixture: ComponentFixture<HeliCamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeliCamComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeliCamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
