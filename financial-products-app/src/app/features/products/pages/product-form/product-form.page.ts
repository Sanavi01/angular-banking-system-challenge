import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { ApiError } from '../../../../core/models/api-error.model';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductFormComponent],
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormPage implements OnDestroy {
  private destroy$ = new Subject<void>();

  readonly submitting$ = new BehaviorSubject<boolean>(false);
  readonly error$ = new BehaviorSubject<string | null>(null);
  readonly success$ = new BehaviorSubject<string | null>(null);

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  onFormSubmit(product: Product): void {
    this.submitting$.next(true);
    this.error$.next(null);

    this.productService
      .create(product)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.success$.next('Producto creado exitosamente');
          this.router.navigate(['/products']);
        },
        error: (err: ApiError) => {
          this.error$.next(err.message);
          this.submitting$.next(false);
        },
      });
  }

  onFormReset(): void {
    this.error$.next(null);
    this.success$.next(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
