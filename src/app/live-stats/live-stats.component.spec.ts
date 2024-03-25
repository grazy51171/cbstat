import { LiveStatsComponent } from './live-stats.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { AppModule } from '../app.module';

describe('LiveStatsComponent', () => {
  beforeEach(() => {
    return MockBuilder(LiveStatsComponent, AppModule);
  });

  it('should create', () => {
    const fixture = MockRender(LiveStatsComponent);
    expect(fixture.point.componentInstance).toBeDefined();
  });
});
