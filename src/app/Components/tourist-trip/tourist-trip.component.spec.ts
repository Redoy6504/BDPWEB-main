import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristTripComponent } from './tourist-trip.component';

describe('TouristTripComponent', () => {
  let component: TouristTripComponent;
  let fixture: ComponentFixture<TouristTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristTripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
