import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturingComponent } from './lecturing.component';

describe('LecturingComponent', () => {
  let component: LecturingComponent;
  let fixture: ComponentFixture<LecturingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LecturingComponent]
    });
    fixture = TestBed.createComponent(LecturingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
