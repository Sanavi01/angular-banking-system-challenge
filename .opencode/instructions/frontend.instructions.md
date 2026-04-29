---
applyTo: "src/app/**/*.ts"
---

> **Scope**: Se aplica a archivos del frontend Angular 14. Este proyecto es frontend-only — el backend es externo (Node.js/Express en `repo-interview-main/`).

# Instrucciones para Archivos de Frontend (Angular 14)

## Stack

| Herramienta | Versión |
|-------------|---------|
| Angular | 14 |
| TypeScript | 4.8+ |
| Estilos | SCSS (sin frameworks de estilos: no Bootstrap, no Tailwind, no Angular Material) |
| HTTP Client | `@angular/common/http` (`HttpClient`) |
| Router | `@angular/router` |
| Testing | Jest |

---

## Arquitectura de Carpetas

```
src/
  app/
    core/                               ← Singleton, app-wide
      interceptors/
        error.interceptor.ts            ← [NUEVO] Interceptor HTTP global
      models/
        product.model.ts                ← Interfaz Product
        api-error.model.ts              ← [NUEVO] Tipo de error de API
      services/
        product.service.ts              ← Llamadas HTTP al backend
    features/
      products/
        pages/
          product-list/
            product-list.page.ts        ← Smart: orquesta datos + compone componentes
            product-list.page.scss
            product-list.page.html
          product-form/
            product-form.page.ts        ← Smart: carga/guarda vía ProductService
            product-form.page.scss
            product-form.page.html
        components/
          product-form/
            product-form.component.ts   ← Dumb: formulario reactivo, @Input/@Output
            product-form.component.scss
            product-form.component.html
          product-menu/
            product-menu.component.ts   ← Dumb: menú contextual
            product-menu.component.scss
            product-menu.component.html
        services/
          product-state.service.ts      ← [NUEVO] Facade: estado del listado (RxJS)
    shared/
      components/
        product-table/
          product-table.component.ts    ← Dumb: tabla de productos
          product-table.component.scss
          product-table.component.html
        product-search/
          product-search.component.ts   ← Dumb: input de búsqueda
          product-search.component.scss
          product-search.component.html
        product-pagination/
          product-pagination.component.ts ← Dumb: selector y contador
          product-pagination.component.scss
          product-pagination.component.html
      pipes/
        date-display.pipe.ts            ← [NUEVO] Transforma YYYY-MM-DD → DD/MM/YYYY
      utils/
        date.util.ts                    ← [NUEVO] Helpers de fecha (addOneYear, etc.)
      validators/
        product-validators.ts           ← [NUEVO] Constantes de validación compartidas
        date-not-past.validator.ts      ← Validador fecha ≥ hoy
        id-exists.validator.ts          ← Validador asíncrono ID único
  environments/
    environment.ts                      ← apiUrl: 'http://localhost:3002'
```

---

## Principios SOLID Aplicados

### S — Single Responsibility (SRP)

Cada archivo tiene una sola razón para cambiar:

| Capa | Responsabilidad única |
|------|----------------------|
| `ProductService` | Solo llamadas HTTP |
| `ProductStateService` | Solo estado RxJS del listado |
| `ProductListPage` | Solo orquestar: inyectar servicios + componer componentes |
| `ProductTableComponent` | Solo renderizar tabla (dumb) |
| `ProductFormComponent` | Solo renderizar y validar formulario (dumb) |
| `ProductFormPage` | Solo orquestar guardado (create/update) y navegación |

### O — Open/Closed

Componentes dumb extendibles por `@Input()` sin modificar su código interno.

### L — Liskov Substitution

No hay herencia de clases en este proyecto. Los componentes usan composición.

### I — Interface Segregation

Interfaces pequeñas y específicas:
```typescript
export interface Product { id, name, description, logo, date_release, date_revision }
export interface ApiError { message: string }
export interface PageEvent { page: number; pageSize: number }
```

### D — Dependency Inversion

Las páginas dependen de abstracciones (servicios inyectables), no de implementaciones concretas. Los componentes dumb dependen de `@Input()`, no de servicios.

---

## Convenciones Obligatorias

- **SCSS**: SIEMPRE usar archivos `.scss` por componente. NUNCA usar frameworks CSS.
- **Nombres**: PascalCase para componentes/páginas, camelCase para servicios/utils.
- **Standalone components**: `standalone: true` en todos los componentes.
- **Change Detection**: `ChangeDetectionStrategy.OnPush` en todos los componentes.
- **API calls**: NUNCA llamar `HttpClient` directamente desde componentes. Usar servicios.
- **Smart/Dumb**: Páginas (smart) inyectan servicios y orquestan. Componentes (dumb) solo reciben `@Input()` y emiten `@Output()`.
- **Estado**: Centralizado en `ProductStateService` con `BehaviorSubject` + RxJS. Sin estado duplicado.
- **Suscripciones**: Usar `takeUntil` + `Subject<void>` para evitar memory leaks (Angular 14).
- **Validaciones**: Usar helper `PRODUCT_VALIDATORS` compartido entre creación y edición.

---

## Smart/Dumb Pattern

```
Smart Page (ProductListPage)         Dumb Components
┌─────────────────────────┐          ┌──────────────────┐
│ Inyecta servicios       │          │ @Input() data     │
│ Orquesta estado         │──props──►│ @Output() events  │
│ Maneja navegación       │◄─events──│ Solo renderiza    │
│ NO lógica de render     │          │ NO servicios      │
└─────────────────────────┘          └──────────────────┘
```

---

## ProductStateService — Facade de Estado (SRP)

```typescript
// features/products/services/product-state.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { Product } from '../../../core/models/product.model';

@Injectable()
export class ProductStateService implements OnDestroy {
  private destroy$ = new Subject<void>();

  // Fuentes de estado
  private allProducts$ = new BehaviorSubject<Product[]>([]);
  private searchTerm$ = new BehaviorSubject<string>('');
  private pageSize$ = new BehaviorSubject<number>(5);
  private currentPage$ = new BehaviorSubject<number>(1);

  // Derivaciones reactivas
  filteredProducts$: Observable<Product[]> = combineLatest([
    this.allProducts$,
    this.searchTerm$,
  ]).pipe(
    map(([products, term]) => this.filterProducts(products, term)),
  );

  paginatedProducts$: Observable<Product[]> = combineLatest([
    this.filteredProducts$,
    this.pageSize$,
    this.currentPage$,
  ]).pipe(
    map(([products, size, page]) =>
      products.slice((page - 1) * size, page * size)
    ),
  );

  totalFiltered$: Observable<number> = this.filteredProducts$.pipe(
    map((products) => products.length),
  );

  // Acciones
  setProducts(products: Product[]): void {
    this.allProducts$.next(products);
  }

  setSearchTerm(term: string): void {
    this.searchTerm$.next(term);
    this.currentPage$.next(1); // Reset a página 1
  }

  setPageSize(size: number): void {
    this.pageSize$.next(size);
    this.currentPage$.next(1); // Reset a página 1
  }

  setPage(page: number): void {
    this.currentPage$.next(page);
  }

  private filterProducts(products: Product[], term: string): Product[] {
    if (!term || term.trim() === '') return products;
    const t = term.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        p.description.toLowerCase().includes(t),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## ErrorInterceptor — Manejo Global de Errores

```typescript
// core/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'Error inesperado del servidor';
        if (error.status === 404) {
          message = 'Recurso no encontrado';
        } else if (error.status === 400) {
          message = error.error?.message || 'Datos inválidos';
        } else if (error.status === 0) {
          message = 'No se puede conectar con el servidor. Verifique que esté en ejecución.';
        }
        return throwError(() => ({ status: error.status, message }));
      }),
    );
  }
}
```

---

## Validaciones Compartidas (DRY)

```typescript
// shared/validators/product-validators.ts
import { Validators } from '@angular/forms';

export const PRODUCT_VALIDATORS = {
  id: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
  name: [Validators.required, Validators.minLength(5), Validators.maxLength(100)],
  description: [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
  logo: [Validators.required],
  date_release: [Validators.required],
  date_revision: [Validators.required],
};

export const PRODUCT_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  id: {
    required: 'Este campo es requerido',
    minlength: 'El ID debe tener entre 3 y 10 caracteres',
    maxlength: 'El ID debe tener entre 3 y 10 caracteres',
    idExists: 'Este ID ya existe. Elija otro identificador.',
  },
  name: {
    required: 'Este campo es requerido',
    minlength: 'El nombre debe tener entre 5 y 100 caracteres',
    maxlength: 'El nombre debe tener entre 5 y 100 caracteres',
  },
  description: {
    required: 'Este campo es requerido',
    minlength: 'La descripción debe tener entre 10 y 200 caracteres',
    maxlength: 'La descripción debe tener entre 10 y 200 caracteres',
  },
  logo: {
    required: 'Este campo es requerido',
  },
  date_release: {
    required: 'Este campo es requerido',
    dateNotPast: 'La fecha de liberación debe ser igual o posterior a hoy',
  },
  date_revision: {
    required: 'Este campo es requerido',
  },
};
```

---

## Date Util y Pipe (DRY)

```typescript
// shared/utils/date.util.ts
export class DateUtil {
  static addOneYear(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const isLeapDay = month === 2 && day === 29;
    if (isLeapDay && !DateUtil.isLeapYear(year + 1)) {
      return `${year + 1}-02-28`;
    }
    return `${year + 1}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  static toDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  private static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
}
```

```typescript
// shared/pipes/date-display.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DateUtil } from '../utils/date.util';

@Pipe({ name: 'dateDisplay', standalone: true })
export class DateDisplayPipe implements PipeTransform {
  transform(value: string): string {
    return DateUtil.toDisplay(value);
  }
}
```

---

## Manejo de Suscripciones (Angular 14)

Sin `takeUntilDestroyed()` (Angular 16+), usar patrón `takeUntil` + `Subject`:

```typescript
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({ ... })
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.someObservable$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // ...
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Llamadas a la API Backend

```typescript
// core/services/product.service.ts
@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/bp/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(this.apiUrl).pipe(
      map((res) => res.data),
    );
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<{ message: string; data: Product }>(this.apiUrl, product).pipe(
      map((res) => res.data),
    );
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<{ message: string; data: Product }>(`${this.apiUrl}/${id}`, product).pipe(
      map((res) => res.data),
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      map(() => undefined),
    );
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }
}
```

---

## Rutas (Angular Router con lazy loading)

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () => import('./features/products/pages/product-list/product-list.page')
      .then(m => m.ProductListPage),
  },
  {
    path: 'products/add',
    loadComponent: () => import('./features/products/pages/product-form/product-form.page')
      .then(m => m.ProductFormPage),
  },
  {
    path: 'products/edit/:id',
    loadComponent: () => import('./features/products/pages/product-form/product-form.page')
      .then(m => m.ProductFormPage),
  },
];
```

---

## Validaciones (Formularios Reactivos + Helper)

```typescript
import { PRODUCT_VALIDATORS } from '../../shared/validators/product-validators';

// En ProductFormComponent
this.form = this.fb.group({
  id: ['', {
    validators: PRODUCT_VALIDATORS.id,
    asyncValidators: isEditMode ? [] : [this.idExistsValidator.validate.bind(this.idExistsValidator)],
    updateOn: 'blur',
  }],
  name: ['', PRODUCT_VALIDATORS.name],
  description: ['', PRODUCT_VALIDATORS.description],
  logo: ['', PRODUCT_VALIDATORS.logo],
  date_release: ['', [Validators.required, dateNotPastValidator()]],
  date_revision: [{ value: '', disabled: true }, PRODUCT_VALIDATORS.date_revision],
});
```

---

## Nunca hacer

- Llamar `HttpClient` desde componentes o páginas — usar servicios.
- Usar frameworks CSS (Bootstrap, Tailwind, Material) — solo SCSS puro.
- Duplicar lógica de estado entre componentes — centralizar en `ProductStateService`.
- Usar `any` como tipo — tipar todo con interfaces.
- Dejar suscripciones activas — siempre `takeUntil(destroy$)`.
- Duplicar mensajes de validación — usar `PRODUCT_ERROR_MESSAGES`.
- Mezclar lógica de fecha — usar `DateUtil`.
- Tener estado de loading/error en componentes dumb — manejar en smart pages.

---

> Para estándares de código limpio, SOLID, nombrado, API REST, seguridad y observabilidad, ver `.opencode/docs/lineamientos/dev-guidelines.md`.
