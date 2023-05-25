import { TestBed } from '@angular/core/testing';

import { AccessDiaryService } from './access-diary.service';

describe('AccessDiaryService', () => {
  let service: AccessDiaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessDiaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
