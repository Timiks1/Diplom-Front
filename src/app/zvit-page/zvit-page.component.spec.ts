import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZvitPageComponent } from './zvit-page.component';

describe('ZvitPageComponent', () => {
  let component: ZvitPageComponent;
  let fixture: ComponentFixture<ZvitPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZvitPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZvitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
