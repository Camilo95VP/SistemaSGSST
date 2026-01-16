/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActuarComponent } from './actuar.component';

describe('ActuarComponent', () => {
  let component: ActuarComponent;
  let fixture: ComponentFixture<ActuarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActuarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActuarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
