import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError } from '../models/api-error.model';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'Error inesperado del servidor';
        if (error.status === 404) {
          message = 'Recurso no encontrado';
        } else if (error.status === 400) {
          message = error.error?.message || 'Datos inválidos';
        } else if (error.status === 0) {
          message =
            'No se puede conectar con el servidor. Verifique que esté en ejecución.';
        }
        const apiError: ApiError = { status: error.status, message };
        return throwError(() => apiError);
      }),
    );
  }
}
