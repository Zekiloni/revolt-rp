import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankMenuComponent } from './bank-menu.component';

describe('BankMenuComponent', () => {
  let component: BankMenuComponent;
  let fixture: ComponentFixture<BankMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BankMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
