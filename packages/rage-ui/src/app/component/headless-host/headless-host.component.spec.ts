import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlessHostComponent } from './headless-host.component';

describe('HeadlessHostComponent', () => {
  let component: HeadlessHostComponent;
  let fixture: ComponentFixture<HeadlessHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadlessHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadlessHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
