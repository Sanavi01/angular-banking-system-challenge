---
applyTo: "src/**/*.spec.ts"
---

> **Scope**: Se aplica a archivos de pruebas unitarias del frontend Angular con Jest.

# Instrucciones para Archivos de Pruebas Unitarias (Angular + Jest)

## Principios

- **Independencia**: cada test es 100% independiente — sin estado compartido entre tests.
- **Aislamiento**: mockear SIEMPRE dependencias externas (HttpClient, Router, servicios).
- **Claridad**: nombre del test debe describir el escenario bajo prueba (qué pasa cuando X).
- **Cobertura**: cubrir happy path, error path y edge cases para cada unidad. Mínimo 70%.

## Estructura de archivos

```
src/app/
  core/services/product.service.spec.ts
  features/<feature>/
    pages/**/*.spec.ts
    components/**/*.spec.ts
    services/*.spec.ts
  shared/
    components/**/*.spec.ts
    pipes/**/*.spec.ts
```

## Convenciones Jest + Angular

- Nombre del `describe`: nombre del componente/servicio/pipe.
- Nombre del `it`: `[verbo] [qué hace] [condición]` (ej: `should render empty state when no products`).
- Usar `jest.fn()` y `jest.spyOn()` para mockear dependencias.
- Siempre limpiar mocks con `beforeEach(() => jest.clearAllMocks())`.

```typescript
// Ejemplo mínimo de test de servicio Angular con HttpClient
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all products', () => {
    const mockProducts = { data: [{ id: '1', name: 'Test' }] };
    service.getAll().subscribe((res) => {
      expect(res.data).toEqual(mockProducts.data);
    });
    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should handle 404 error', () => {
    service.getById('nonexistent').subscribe({
      error: (err) => {
        expect(err.status).toBe(404);
      },
    });
    const req = httpMock.expectOne('http://localhost:3002/bp/products/nonexistent');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
```

## Ejemplo de test de componente

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductSearchComponent } from './product-search.component';

describe('ProductSearchComponent', () => {
  let component: ProductSearchComponent;
  let fixture: ComponentFixture<ProductSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductSearchComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render search input', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
    expect(input.nativeElement.placeholder).toContain('Search');
  });

  it('should emit search term on input', () => {
    jest.spyOn(component.searchChange, 'emit');
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchChange.emit).toHaveBeenCalledWith('test');
  });
});
```

## Nunca hacer

- Tests que dependen del orden de ejecución.
- Llamadas HTTP reales (usar `HttpTestingController`).
- `console.log` permanentes en tests.
- Lógica condicional dentro de un test (if/else).
- Usar `setTimeout` para sincronización temporal (cero tests "flaky").
- Crear estado compartido entre tests de un mismo `describe`.

## Estructura AAA obligatoria

```
// GIVEN — preparar datos y contexto
// WHEN  — ejecutar la acción bajo prueba
// THEN  — verificar el resultado esperado
```
