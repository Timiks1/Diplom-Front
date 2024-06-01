import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeVisitsPageComponent } from './exchange-visits-page.component';

describe('ExchangeVisitsPageComponent', () => {
  let component: ExchangeVisitsPageComponent;
  let fixture: ComponentFixture<ExchangeVisitsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeVisitsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeVisitsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
