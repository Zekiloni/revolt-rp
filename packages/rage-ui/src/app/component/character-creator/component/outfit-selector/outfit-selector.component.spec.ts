import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutfitSelectorComponent } from './outfit-selector.component';

describe('OutfitSelectorComponent', () => {
  let component: OutfitSelectorComponent;
  let fixture: ComponentFixture<OutfitSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutfitSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutfitSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
