import { TestBed } from '@angular/core/testing';

import { StatTokenService } from './stat-token.service';

describe('StatTokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatTokenService = TestBed.get(StatTokenService);
    expect(service).toBeTruthy();
  });
});
