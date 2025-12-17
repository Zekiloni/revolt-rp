import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentMenuComponent } from './equipment-menu.component';

describe('EquipmentMenuComponent', () => {
  let component: EquipmentMenuComponent;
  let fixture: ComponentFixture<EquipmentMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
