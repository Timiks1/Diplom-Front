import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualPlanPageComponent } from './individual-plan-page.component';

describe('IndividualPlanPageComponent', () => {
  let component: IndividualPlanPageComponent;
  let fixture: ComponentFixture<IndividualPlanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualPlanPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualPlanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
