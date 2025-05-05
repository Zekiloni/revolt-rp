import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrafitiCreatorComponent } from './grafiti-creator.component';

describe('GrafitiCreatorComponent', () => {
  let component: GrafitiCreatorComponent;
  let fixture: ComponentFixture<GrafitiCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafitiCreatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrafitiCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
