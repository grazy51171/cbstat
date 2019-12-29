import { TestBed } from '@angular/core/testing';

import { ShowStatisticsService } from './show-statistics.service';

describe('ShowStatisticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowStatisticsService = TestBed.get(ShowStatisticsService);
    expect(service).toBeTruthy();
  });
});
