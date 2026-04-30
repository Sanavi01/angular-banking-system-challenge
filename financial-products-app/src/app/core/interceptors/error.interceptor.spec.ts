import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';
import { ApiError } from '../models/api-error.model';

describe('ErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should transform 404 error to "Recurso no encontrado"', () => {
    let apiError: ApiError | null = null;

    http.get('/test').subscribe({
      error: (err: ApiError) => (apiError = err),
    });

    const req = httpMock.expectOne('/test');
    req.flush(null, { status: 404, statusText: 'Not Found' });

    expect(apiError).toEqual({
      status: 404,
      message: 'Recurso no encontrado',
    });
  });

  it('should transform 400 error with server message', () => {
    let apiError: ApiError | null = null;
    const serverMessage = 'ID ya existe';

    http.get('/test').subscribe({
      error: (err: ApiError) => (apiError = err),
    });

    const req = httpMock.expectOne('/test');
    req.flush({ message: serverMessage }, { status: 400, statusText: 'Bad Request' });

    expect(apiError).toEqual({
      status: 400,
      message: serverMessage,
    });
  });

  it('should transform 400 error without server message to default', () => {
    let apiError: ApiError | null = null;

    http.get('/test').subscribe({
      error: (err: ApiError) => (apiError = err),
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(apiError).toEqual({
      status: 400,
      message: 'Datos inválidos',
    });
  });

  it('should transform status 0 (network error) to connection message', () => {
    let apiError: ApiError | null = null;

    http.get('/test').subscribe({
      error: (err: ApiError) => (apiError = err),
    });

    const req = httpMock.expectOne('/test');
    req.error(new ProgressEvent('error'));

    expect(apiError).toEqual({
      status: 0,
      message: 'No se puede conectar con el servidor. Verifique que esté en ejecución.',
    });
  });

  it('should transform unexpected error (e.g. 500) to default message', () => {
    let apiError: ApiError | null = null;

    http.get('/test').subscribe({
      error: (err: ApiError) => (apiError = err),
    });

    const req = httpMock.expectOne('/test');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });

    expect(apiError).toEqual({
      status: 500,
      message: 'Error inesperado del servidor',
    });
  });
});
