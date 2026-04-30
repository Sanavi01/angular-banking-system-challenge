import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductService } from '../../core/services/product.service';

@Injectable({ providedIn: 'root' })
export class IdExistsValidator {
  constructor(private productService: ProductService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }
    return this.productService.verifyId(control.value).pipe(
      map((exists) => (exists ? { idExists: true } : null)),
      catchError(() => of(null)),
    );
  }
}
