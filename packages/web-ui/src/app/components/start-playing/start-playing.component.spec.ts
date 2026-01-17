import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPlayingComponent } from './start-playing.component';

describe('StartPlayingComponent', () => {
  let component: StartPlayingComponent;
  let fixture: ComponentFixture<StartPlayingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartPlayingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartPlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
