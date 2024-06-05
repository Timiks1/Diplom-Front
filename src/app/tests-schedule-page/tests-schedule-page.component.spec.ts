import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsSchedulePageComponent } from './tests-schedule-page.component';

describe('TestsSchedulePageComponent', () => {
  let component: TestsSchedulePageComponent;
  let fixture: ComponentFixture<TestsSchedulePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestsSchedulePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsSchedulePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
