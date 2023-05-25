import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturingDetailsComponent } from './lecturing-details.component';

describe('LecturingDetailsComponent', () => {
  let component: LecturingDetailsComponent;
  let fixture: ComponentFixture<LecturingDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LecturingDetailsComponent]
    });
    fixture = TestBed.createComponent(LecturingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
