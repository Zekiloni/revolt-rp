import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HandheldRadioComponent } from './handheld-radio.component';

describe('HandheldRadioComponent', () => {
  let component: HandheldRadioComponent;
  let fixture: ComponentFixture<HandheldRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandheldRadioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HandheldRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
