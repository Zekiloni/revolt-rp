import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SobrietyTestComponent } from './sobriety-test.component';

describe('SobrietyTestComponent', () => {
  let component: SobrietyTestComponent;
  let fixture: ComponentFixture<SobrietyTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobrietyTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SobrietyTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
