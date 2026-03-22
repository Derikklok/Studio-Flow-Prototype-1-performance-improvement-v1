import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectDialog } from './view-project-dialog';

describe('ViewProjectDialog', () => {
  let component: ViewProjectDialog;
  let fixture: ComponentFixture<ViewProjectDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProjectDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProjectDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
