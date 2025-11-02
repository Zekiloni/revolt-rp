import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewWhitelistApplicationComponent } from './review-whitelist-application.component';

describe('ReviewWhitelistApplicationComponent', () => {
  let component: ReviewWhitelistApplicationComponent;
  let fixture: ComponentFixture<ReviewWhitelistApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewWhitelistApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewWhitelistApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
