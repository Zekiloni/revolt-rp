import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerOfferComponent } from './player-offer.component';

describe('PlayerOfferComponent', () => {
  let component: PlayerOfferComponent;
  let fixture: ComponentFixture<PlayerOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerOfferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
