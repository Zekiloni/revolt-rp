import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageRanksComponent } from './manage-ranks.component';

describe('ManageRanksComponent', () => {
  let component: ManageRanksComponent;
  let fixture: ComponentFixture<ManageRanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRanksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageRanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
