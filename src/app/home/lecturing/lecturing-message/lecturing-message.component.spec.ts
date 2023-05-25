import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturingMessageComponent } from './lecturing-message.component';

describe('LecturingMessageComponent', () => {
  let component: LecturingMessageComponent;
  let fixture: ComponentFixture<LecturingMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LecturingMessageComponent]
    });
    fixture = TestBed.createComponent(LecturingMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
