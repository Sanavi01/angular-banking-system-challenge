// Jest Component Test Template for Angular
// Ruta: src/app/<path>/<name>.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { {{ComponentName}}Component } from './{{component-name}}.component';

describe('{{ComponentName}}Component', () => {
  let component: {{ComponentName}}Component;
  let fixture: ComponentFixture<{{ComponentName}}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [{{ComponentName}}Component],
    }).compileComponents();

    fixture = TestBed.createComponent({{ComponentName}}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
