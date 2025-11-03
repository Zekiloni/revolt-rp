import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterViewComponent } from './character-view.component';

describe('CharacterPageComponent', () => {
  let component: CharacterViewComponent;
  let fixture: ComponentFixture<CharacterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
