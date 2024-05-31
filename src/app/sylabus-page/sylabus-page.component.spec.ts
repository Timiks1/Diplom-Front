import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SylabusPageComponent } from './sylabus-page.component';

describe('SylabusPageComponent', () => {
  let component: SylabusPageComponent;
  let fixture: ComponentFixture<SylabusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SylabusPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SylabusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
