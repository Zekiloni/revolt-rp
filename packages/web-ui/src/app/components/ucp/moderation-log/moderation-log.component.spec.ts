import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationLogComponent } from './moderation-log.component';

describe('ModerationLogComponent', () => {
  let component: ModerationLogComponent;
  let fixture: ComponentFixture<ModerationLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModerationLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
