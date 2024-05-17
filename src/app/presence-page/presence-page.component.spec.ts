import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresencePageComponent } from './presence-page.component';

describe('PresencePageComponent', () => {
  let component: PresencePageComponent;
  let fixture: ComponentFixture<PresencePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresencePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresencePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
