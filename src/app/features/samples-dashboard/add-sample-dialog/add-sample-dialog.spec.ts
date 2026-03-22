import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSampleDialog } from './add-sample-dialog';

describe('AddSampleDialog', () => {
  let component: AddSampleDialog;
  let fixture: ComponentFixture<AddSampleDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSampleDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSampleDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
