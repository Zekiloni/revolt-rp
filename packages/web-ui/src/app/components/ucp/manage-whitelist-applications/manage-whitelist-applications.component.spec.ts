import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWhitelistApplicationsComponent } from './manage-whitelist-applications.component';

describe('ManageWhitelistApplicationsComponent', () => {
  let component: ManageWhitelistApplicationsComponent;
  let fixture: ComponentFixture<ManageWhitelistApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageWhitelistApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageWhitelistApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
