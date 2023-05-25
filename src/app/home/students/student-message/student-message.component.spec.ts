import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMessageComponent } from './student-message.component';

describe('StudentMessageComponent', () => {
  let component: StudentMessageComponent;
  let fixture: ComponentFixture<StudentMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentMessageComponent]
    });
    fixture = TestBed.createComponent(StudentMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
