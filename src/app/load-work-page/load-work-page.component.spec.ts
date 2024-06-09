import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadWorkPageComponent } from './load-work-page.component';

describe('LoadWorkPageComponent', () => {
  let component: LoadWorkPageComponent;
  let fixture: ComponentFixture<LoadWorkPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadWorkPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadWorkPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
