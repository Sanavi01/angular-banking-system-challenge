---
id: SPEC-003
status: IMPLEMENTED
feature: f3-paginacion-registros
created: 2026-04-29
updated: 2026-04-29
author: spec-generator
version: "1.0"
dependencies: [SPEC-001]
related-specs: [SPEC-002]
---

# Spec: F3 — Paginación y Cantidad de Registros

> **Estado:** `IMPLEMENTED`
> **Diseño de referencia:** D1 (Listado — footer con contador y select)
> **Tipo:** Requerido
> **Depende de:** SPEC-001 (ProductListPage, ProductTableComponent)

---

## 1. REQUERIMIENTOS

### Descripción
Control de paginación en el footer del listado que permite al operador seleccionar cuántos productos ver por página (5, 10 o 20) y muestra el total de resultados actuales. La paginación opera sobre los datos ya filtrados por búsqueda (SPEC-002) yse implementa del lado del cliente.

> **Nota de deuda técnica:** La API `GET /bp/products` no acepta query params de paginación (`?page=&limit=`). La práctica correcta es paginación del lado del servidor. Se implementa del lado del cliente como solución temporal. Deuda técnica documentada.

### Requerimiento de Negocio
Fuente: `.opencode/requirements/productos-financieros.md` — F3

### Historias de Usuario

#### HU-03: Controlar cantidad de registros por página

```
Como:        Operador bancario
Quiero:      seleccionar cuántos productos ver por página (5, 10, 20)
Para:        ajustar la densidad de información según mi preferencia y tamaño de pantalla

Prioridad:   Alta
Estimación:  S
Dependencias: HU-01 (SPEC-001)
Capa:        Frontend
```

#### Criterios de Aceptación — HU-03

**Happy Path**
```gherkin
CRITERIO-3.1: Selector con opciones visibles
  Dado que:  el operador está en la página de listado
  Cuando:    observa el footer de la tabla
  Entonces:  ve un texto a la izquierda: "X resultados" (donde X es el total de productos actuales)
  Y:         ve un select a la derecha con las opciones: 5, 10, 20
```

**Happy Path**
```gherkin
CRITERIO-3.2: Cambiar cantidad de registros
  Dado que:  la tabla muestra 5 productos por página (valor por defecto)
  Y:         existen 12 productos en total
  Cuando:    el operador selecciona "10" en el dropdown
  Entonces:  la tabla muestra hasta 10 productos en la página actual
  Y:         el dropdown refleja "10" como seleccionado
  Y:         el contador sigue mostrando "12 resultados"
```

**Happy Path**
```gherkin
CRITERIO-3.3: Paginación con navegación entre páginas
  Dado que:  existen 12 productos en total
  Y:         el pageSize es 5
  Cuando:    el operador hace clic en "Siguiente" (página 2)
  Entonces:  la tabla muestra los productos 6-10
  Y:         el indicador de página muestra "Página 2 de 3"
  Cuando:    hace clic en "Siguiente" (página 3)
  Entonces:  la tabla muestra los productos 11-12
  Y:         el botón "Siguiente" se deshabilita (última página)
```

**Error Path**
```gherkin
CRITERIO-3.4: Cambiar pageSize reinicia a página 1
  Dado que:  el operador está en la página 3 con pageSize 5
  Cuando:    cambia el pageSize a 10
  Entonces:  la tabla vuelve a la página 1
  Y:         muestra los primeros 10 productos
  Y:         el total de páginas se recalcula
```

**Edge Case**
```gherkin
CRITERIO-3.5: Paginación con resultados filtrados
  Dado que:  el operador aplicó un filtro de búsqueda que retorna 3 resultados
  Y:         el pageSize es 5
  Cuando:    observa el footer
  Entonces:  el contador muestra "3 resultados"
  Y:         el control de paginación muestra solo 1 página
  Y:         los botones Anterior/Siguiente están deshabilitados
```

**Edge Case**
```gherkin
CRITERIO-3.6: Paginación con pageSize mayor que total de resultados
  Dado que:  existen 4 productos y pageSize es 20
  Cuando:    se renderiza la tabla
  Entonces:  se muestran los 4 productos
  Y:         el contador muestra "4 resultados"
  Y:         solo hay 1 página
```

### Reglas de Negocio
1. PageSize por defecto: 5.
2. Opciones del select: 5, 10, 20.
3. Al cambiar pageSize, se reinicia a página 1.
4. La paginación opera sobre los datos filtrados (si hay búsqueda activa).
5. El contador muestra el total de productos filtrados, no el total de la API.
6. La paginación es del lado del cliente (deuda técnica por limitación de la API).
7. Los botones de navegación Anterior/Siguiente se deshabilitan en los extremos.

---

## 2. DISEÑO

### API — No se consume endpoint nuevo
La paginación es del lado del cliente.

### Arquitectura Frontend

#### Estructura de archivos a crear/modificar

```
src/app/
├── features/
│   └── products/
│       └── pages/
│           └── product-list/
│               └── product-list.page.ts         ← [MODIFICAR] Conectar paginación con ProductStateService
└── shared/
    └── components/
        └── product-pagination/
            ├── product-pagination.component.ts  ← [NUEVO] Dumb component (OnPush)
            ├── product-pagination.component.scss← [NUEVO] Estilos
            └── product-pagination.component.html← [NUEVO] Template
```

#### Componentes

| Componente | Selector | Inputs | Outputs | Descripción |
|------------|----------|--------|---------|-------------|
| `ProductPaginationComponent` | `app-product-pagination` | `totalItems: number`, `currentPage: number`, `pageSize: number`, `totalPages: number` | `pageSizeChange: EventEmitter<number>`, `pageChange: EventEmitter<number>` | Dumb component con `OnPush`. Footer con contador, select y navegación. |

#### Modificaciones a componentes existentes

| Archivo | Cambio |
|---------|--------|
| `product-list.page.ts` | Usar `productStateService.setPageSize()` y `productStateService.setPage()`. Los cálculos de paginación ya los hace `ProductStateService` internamente (SRP). |
| `product-list.page.html` | Reemplazar placeholder de paginación por `<app-product-pagination>`. Pasar observables con `async` pipe. |

#### Flujo de Datos (centralizado en ProductStateService)

```
productStateService.paginatedProducts$ ──► ProductListPage (async pipe) ──► ProductTableComponent
productStateService.totalFiltered$    ──► ProductPaginationComponent @Input

<app-product-pagination (pageSizeChange)="onPageSizeChange($event)">
<app-product-pagination (pageChange)="onPageChange($event)">

onPageSizeChange(size) → productStateService.setPageSize(size)  // Resetea página 1
onPageChange(page)     → productStateService.setPage(page)
```

#### Lógica de Paginación (ya en ProductStateService)

```typescript
// product-list.page.ts
onPageSizeChange(size: number): void {
  this.productStateService.setPageSize(size); // SRP: estado centralizado
}

onPageChange(page: number): void {
  this.productStateService.setPage(page);
}
```

### Consideraciones de Estilo (D1)
- Footer alineado: contador a la izquierda, select a la derecha.
- Select con borde sutil, texto "5", "10", "20".
- Texto "X resultados" en gris medio.
- Layout:

```
┌─────────────────────────────────────────────────┐
│  5 resultados                        [5 ▾]      │
└─────────────────────────────────────────────────┘
```

---

## 3. LISTA DE TAREAS

### Frontend — Implementación

#### Componente — ProductPagination
- [x] Crear `product-pagination.component.ts` (standalone)
- [x] Implementar `@Input() totalItems: number`
- [x] Implementar `@Input() pageSize: number`
- [x] Implementar `@Output() pageSizeChange = new EventEmitter<number>()`
- [x] Implementar `@Output() pageChange = new EventEmitter<number>()`
- [x] Renderizar texto "X resultados" con pluralización correcta ("1 resultado", "X resultados")
- [x] Renderizar select con opciones 5, 10, 20
- [x] Emitir `pageSizeChange` al cambiar el select
- [x] Renderizar botones Anterior / Indicador de página / Siguiente
- [x] Deshabilitar Anterior en página 1
- [x] Deshabilitar Siguiente en última página
- [x] Mostrar "Página X de Y" entre los botones de navegación
- [x] Crear estilos SCSS según Diseño D1

#### Página — ProductListPage (modificaciones)
- [x] Agregar propiedad `currentPage = 1` (ya en ProductStateService — no duplicado)
- [x] Agregar propiedad `pageSize = 5` (ya en ProductStateService)
- [x] Implementar getter `totalPages` (ya en ProductStateService)
- [x] Implementar getter `paginatedProducts` (ya en ProductStateService)
- [x] Implementar `onPageSizeChange(size: number)` (via `state.setPageSize()`)
- [x] Implementar `onPageChange(direction)` (via `state.setPage()`)
- [x] Pasar `paginatedProducts` al `ProductTableComponent` (via `paginatedProducts$`)
- [x] Pasar `filteredProducts.length` como `totalItems` al `ProductPaginationComponent`
- [x] Asegurar integración correcta con búsqueda (SPEC-002): al filtrar, reiniciar página a 1

### Tests — Jest

#### ProductPaginationComponent
- [x] `should display correct result count` — verificar "X resultados"
- [x] `should display "1 resultado" when total is 1` — singular
- [x] `should display "0 resultados" when total is 0` — adicional
- [x] `should render select with options 5, 10, 20` — verificar opciones
- [x] `should emit pageSizeChange when select changes` — cambiar a 10
- [x] `should emit pageSizeChange with correct value` — verificar valor 20
- [x] `should disable prev button on first page` — verificar atributo disabled
- [x] `should disable next button on last page` — verificar atributo disabled
- [x] `should enable both buttons on middle page` — adicional
- [x] `should disable both buttons when only 1 page` — adicional
- [x] `should display current page indicator` — "Página X de Y"
- [x] `should emit pageChange with previous page on goToPrevious` — adicional
- [x] `should not emit pageChange on goToPrevious when on first page` — adicional
- [x] `should emit pageChange with next page on goToNext` — adicional
- [x] `should not emit pageChange on goToNext when on last page` — adicional
- [x] `should return correct values for isFirstPage` — adicional
- [x] `should return correct values for isLastPage` — adicional

#### ProductListPage (modificaciones)
- [x] `should paginate products correctly` — ya probado via ProductStateService.spec.ts
- [x] `should show next products when navigating` — ya via setPage()
- [x] `should reset to page 1 when pageSize changes` — ya via setPageSize()
- [x] `should reset page when search filter changes` — ya via setSearchTerm()

### QA
- [ ] Ejecutar `/gherkin-case-generator` para HU-03
- [ ] Ejecutar `/risk-identifier` para SPEC-003
- [ ] Verificar integración con SPEC-001 y SPEC-002
- [ ] Probar todos los escenarios de página: primera, intermedia, última
- [ ] Validar visualmente contra Diseño D1 (footer)
