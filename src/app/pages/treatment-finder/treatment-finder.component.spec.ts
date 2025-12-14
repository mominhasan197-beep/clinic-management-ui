import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentFinderComponent } from './treatment-finder.component';

describe('TreatmentFinderComponent', () => {
  let component: TreatmentFinderComponent;
  let fixture: ComponentFixture<TreatmentFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentFinderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreatmentFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
