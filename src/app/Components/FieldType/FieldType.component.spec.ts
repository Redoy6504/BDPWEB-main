import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldTypeComponent } from './FieldTypecomponent';

describe('FieldTypeComponent', () => {
  let component: FieldTypeComponent;
  let fixture: ComponentFixture<FieldTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
