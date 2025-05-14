import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GangRecordComponent } from './gang-record.component';

describe('GangRecordComponent', () => {
  let component: GangRecordComponent;
  let fixture: ComponentFixture<GangRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GangRecordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GangRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
