/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PublificationTableComponent } from './publification-table.component';

describe('PublificationTableComponent', () => {
  let component: PublificationTableComponent;
  let fixture: ComponentFixture<PublificationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublificationTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublificationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
