import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlateRecognitionComponent } from './plate-recognition.component';

describe('PlateRecognitionComponent', () => {
  let component: PlateRecognitionComponent;
  let fixture: ComponentFixture<PlateRecognitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlateRecognitionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlateRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
