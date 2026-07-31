import { TestBed } from '@angular/core/testing';

import { AccesscodeService } from './accesscode.service';

describe('AccesscodeService', () => {
  let service: AccesscodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesscodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
