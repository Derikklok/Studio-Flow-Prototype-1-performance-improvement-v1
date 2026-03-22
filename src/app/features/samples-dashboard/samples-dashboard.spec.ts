import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesDashboard } from './samples-dashboard';

describe('SamplesDashboard', () => {
  let component: SamplesDashboard;
  let fixture: ComponentFixture<SamplesDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplesDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(SamplesDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
