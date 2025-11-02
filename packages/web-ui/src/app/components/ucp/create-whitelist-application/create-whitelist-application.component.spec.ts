import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWhitelistApplicationComponent } from './create-whitelist-application.component';

describe('CreateWhitelistApplicationComponent', () => {
  let component: CreateWhitelistApplicationComponent;
  let fixture: ComponentFixture<CreateWhitelistApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWhitelistApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateWhitelistApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
