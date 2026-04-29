// Jest Service Test Template for Angular
// Ruta: src/app/<path>/<name>.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { {{ServiceName}}Service } from './{{service-name}}.service';

describe('{{ServiceName}}Service', () => {
  let service: {{ServiceName}}Service;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {{ServiceName}}Service,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject({{ServiceName}}Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all items', () => {
    const mockData = { data: [] };
    service.getAll().subscribe((res) => {
      expect(res).toEqual(mockData);
    });
    const req = httpMock.expectOne('http://localhost:3002/bp/{{endpoint}}');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
