/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlanearComponent } from './planear.component';

describe('PlanearComponent', () => {
  let component: PlanearComponent;
  let fixture: ComponentFixture<PlanearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
