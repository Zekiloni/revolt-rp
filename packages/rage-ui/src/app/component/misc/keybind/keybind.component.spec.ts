import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeybindComponent } from './keybind.component';

describe('KeybindComponent', () => {
  let component: KeybindComponent;
  let fixture: ComponentFixture<KeybindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeybindComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeybindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
