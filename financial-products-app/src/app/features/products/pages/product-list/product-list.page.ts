import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService } from '../../../../core/services/product.service';
import { ProductStateService } from '../../services/product-state.service';
import { Product } from '../../../../core/models/product.model';
import { ApiError } from '../../../../core/models/api-error.model';
import { ProductTableComponent } from '../../../../shared/components/product-table/product-table.component';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, ProductTableComponent],
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductStateService],
})
export class ProductListPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  readonly loading$ = new BehaviorSubject<boolean>(true);
  readonly error$ = new BehaviorSubject<string | null>(null);

  constructor(
    private productService: ProductService,
    public state: ProductStateService,
  ) {}

  ngOnInit(): void {
    this.productService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products: Product[]) => {
          this.state.setProducts(products);
          this.loading$.next(false);
        },
        error: (err: ApiError) => {
          this.error$.next(err.message);
          this.loading$.next(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
