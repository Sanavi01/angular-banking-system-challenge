import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Product } from '../../../core/models/product.model';

@Injectable()
export class ProductStateService implements OnDestroy {
  private destroy$ = new Subject<void>();

  private readonly allProducts$ = new BehaviorSubject<Product[]>([]);
  private readonly searchTerm$ = new BehaviorSubject<string>('');
  private readonly pageSize$ = new BehaviorSubject<number>(5);
  private readonly currentPage$ = new BehaviorSubject<number>(1);

  readonly filteredProducts$: Observable<Product[]> = combineLatest([
    this.allProducts$,
    this.searchTerm$,
  ]).pipe(
    map(([products, term]) => this.filterProducts(products, term)),
    takeUntil(this.destroy$),
  );

  readonly paginatedProducts$: Observable<Product[]> = combineLatest([
    this.filteredProducts$,
    this.pageSize$,
    this.currentPage$,
  ]).pipe(
    map(([products, size, page]) =>
      products.slice((page - 1) * size, page * size),
    ),
    takeUntil(this.destroy$),
  );

  readonly totalFiltered$: Observable<number> = this.filteredProducts$.pipe(
    map((products) => products.length),
    takeUntil(this.destroy$),
  );

  readonly totalPages$: Observable<number> = combineLatest([
    this.filteredProducts$,
    this.pageSize$,
  ]).pipe(
    map(([products, size]) => Math.ceil(products.length / size)),
    takeUntil(this.destroy$),
  );

  setProducts(products: Product[]): void {
    this.allProducts$.next(products);
  }

  setSearchTerm(term: string): void {
    this.searchTerm$.next(term);
    this.currentPage$.next(1);
  }

  setPageSize(size: number): void {
    this.pageSize$.next(size);
    this.currentPage$.next(1);
  }

  setPage(page: number): void {
    this.currentPage$.next(page);
  }

  private filterProducts(products: Product[], term: string): Product[] {
    if (!term || term.trim() === '') return products;
    const normalizedTerm = this.normalizeText(term);
    return products.filter(
      (p) =>
        this.normalizeText(p.name).includes(normalizedTerm) ||
        this.normalizeText(p.description).includes(normalizedTerm),
    );
  }

  /**
   * Normaliza texto eliminando tildes y diacríticos (á → a, ñ → n, ü → u)
   * usando descomposición Unicode NFD.
   * Ej: "Préstamos" → "prestamos", "Búsqueda" → "busqueda"
   */
  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
