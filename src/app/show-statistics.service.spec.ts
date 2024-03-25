import { TestBed } from '@angular/core/testing';

import { ShowStatisticsService } from './show-statistics.service';
import { MockBuilder, MockRender } from 'ng-mocks';
import { AppModule } from './app.module';

describe('ShowStatisticsService', () => {
  beforeEach(() => {
    return MockBuilder(ShowStatisticsService, AppModule);
  });

  it('should create', () => {
    const service: ShowStatisticsService = TestBed.inject(ShowStatisticsService);
    expect(service).toBeDefined();
  });
});
