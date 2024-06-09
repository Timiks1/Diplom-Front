import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialiPageComponent } from './materiali-page.component';

describe('MaterialiPageComponent', () => {
  let component: MaterialiPageComponent;
  let fixture: ComponentFixture<MaterialiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialiPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
