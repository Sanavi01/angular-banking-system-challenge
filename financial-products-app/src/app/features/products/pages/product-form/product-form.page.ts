import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
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
export class ProductFormPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  readonly submitting$ = new BehaviorSubject<boolean>(false);
  readonly error$ = new BehaviorSubject<string | null>(null);
  readonly product$ = new BehaviorSubject<Product | null>(null);

  isEditMode = false;
  private productId: string | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.productService
        .getById(this.productId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (product) => this.product$.next(product),
          error: (err: ApiError) => this.error$.next(err.message),
        });
    }
  }

  onFormSubmit(data: Product): void {
    this.submitting$.next(true);
    this.error$.next(null);

    const request$ = this.isEditMode
      ? this.productService.update(this.productId!, data)
      : this.productService.create(data);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
