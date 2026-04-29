---
id: SPEC-002
status: IMPLEMENTED
feature: f2-busqueda-productos
created: 2026-04-29
updated: 2026-04-29
author: spec-generator
version: "1.0"
dependencies: [SPEC-001]
related-specs: [SPEC-003]
---

# Spec: F2 — Búsqueda de Productos Financieros

> **Estado:** `IMPLEMENTED`
> **Diseño de referencia:** D1 (Listado — barra de búsqueda integrada)
> **Tipo:** Requerido
> **Depende de:** SPEC-001 (ProductListPage, ProductTableComponent)

---

## 1. REQUERIMIENTOS

### Descripción
Campo de texto en la parte superior del listado que permite filtrar los productos mostrados en la tabla por coincidencia parcial en los campos `name` y `description`. La búsqueda se ejecuta del lado del cliente (filtra el array devuelto por `getAll()`) con un debounce de 300ms para evitar filtros excesivos durante la escritura.

> **Nota de deuda técnica:** La API `GET /bp/products` no acepta query params de búsqueda. La práctica correcta sería filtrar del lado del servidor (`GET /bp/products?search=termino`). Se implementa del lado del cliente como solución temporal y se documenta la deuda.

### Requerimiento de Negocio
Fuente: `.opencode/requirements/productos-financieros.md` — F2

### Historias de Usuario

#### HU-02: Buscar productos financieros por texto

```
Como:        Operador bancario
Quiero:      filtrar los productos escribiendo en un campo de búsqueda
Para:        encontrar rápidamente un producto específico sin recorrer toda la tabla

Prioridad:   Alta
Estimación:  S
Dependencias: HU-01 (SPEC-001)
Capa:        Frontend
```

#### Criterios de Aceptación — HU-02

**Happy Path**
```gherkin
CRITERIO-2.1: Búsqueda por nombre — coincidencia parcial
  Dado que:  la tabla muestra 10 productos cargados desde la API
  Cuando:    el operador escribe "tarjeta" en el campo de búsqueda
  Entonces:  después de 300ms de inactividad en el input
  Y:         la tabla se actualiza mostrando solo los productos cuyo nombre
             contiene "tarjeta" (case-insensitive)
  Y:         el contador de resultados se actualiza reflejando la nueva cantidad
```

**Happy Path**
```gherkin
CRITERIO-2.2: Búsqueda por descripción — coincidencia parcial
  Dado que:  la tabla muestra productos
  Cuando:    el operador escribe "crédito" en el campo de búsqueda
  Entonces:  la tabla muestra productos cuyo nombre O descripción contienen "crédito"
             (case-insensitive)
```

**Happy Path**
```gherkin
CRITERIO-2.3: Limpiar búsqueda — restaurar listado completo
  Dado que:  el operador aplicó un filtro de búsqueda y la tabla muestra resultados filtrados
  Cuando:    borra todo el texto del campo de búsqueda
  Entonces:  la tabla vuelve a mostrar todos los productos originales
  Y:         el contador de resultados se restaura al total original
```

**Edge Case**
```gherkin
CRITERIO-2.4: Búsqueda sin coincidencias
  Dado que:  la tabla muestra productos
  Cuando:    el operador escribe "xyz123" (término que no coincide con ningún producto)
  Entonces:  la tabla muestra el estado vacío con mensaje:
             "No se encontraron productos que coincidan con la búsqueda."
  Y:         el contador muestra "0 resultados"
```

**Edge Case**
```gherkin
CRITERIO-2.5: Búsqueda con espacios al inicio/final
  Dado que:  el operador escribe "  crédito  " en el campo de búsqueda
  Cuando:    se aplica el filtro
  Entonces:  los espacios se ignoran (trim) y se busca por "crédito"
```

**Edge Case**
```gherkin
CRITERIO-2.6: Búsqueda con campo vacío inicialmente
  Dado que:  el listado carga por primera vez
  Cuando:    el campo de búsqueda está vacío
  Entonces:  se muestran todos los productos sin filtrar
  Y:         el placeholder del input muestra "Search..."
```

### Reglas de Negocio
1. La búsqueda aplica sobre los campos `name` y `description` (OR lógico).
2. La coincidencia es parcial (`includes`) y case-insensitive.
3. Se aplica debounce de 300ms para no filtrar en cada pulsación.
4. Al borrar el texto, se restaura el listado completo.
5. La búsqueda se combina con la paginación (SPEC-003): si hay filtro, el contador y las páginas reflejan solo los resultados filtrados.
6. El input debe tener un placeholder "Search..." (según diseño D1).

---

## 2. DISEÑO

### API — No se consume endpoint nuevo
La búsqueda es del lado del cliente sobre los datos ya cargados por SPEC-001.

### Arquitectura Frontend

#### Estructura de archivos a crear/modificar

```
src/app/
├── features/
│   └── products/
│       └── pages/
│           └── product-list/
│               └── product-list.page.ts         ← [MODIFICAR] Conectar búsqueda con ProductStateService
└── shared/
    └── components/
        └── product-search/
            ├── product-search.component.ts      ← [NUEVO] Dumb component (OnPush)
            ├── product-search.component.scss    ← [NUEVO] Estilos
            └── product-search.component.html    ← [NUEVO] Template
```

#### Componentes

| Componente | Selector | Inputs | Outputs | Descripción |
|------------|----------|--------|---------|-------------|
| `ProductSearchComponent` | `app-product-search` | `placeholder: string` (default: `'Search...'`) | `searchChange: EventEmitter<string>` | Dumb component con `OnPush`. Input reactivo con debounce 300ms. Emite término al padre. |

#### Modificaciones a componentes existentes

| Archivo | Cambio |
|---------|--------|
| `product-list.page.ts` | Recibir evento `searchChange` del `ProductSearchComponent`. Llamar `productStateService.setSearchTerm(term)`. El filtrado ya lo hace `ProductStateService` internamente (SRP). |
| `product-list.page.html` | Reemplazar placeholder de búsqueda por `<app-product-search>`. |
| `product-list.page.scss` | Ajustar layout del header si es necesario. |

#### Flujo de Datos (centralizado en ProductStateService)

```
ProductService.getAll() → state.setProducts(allProducts)
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            allProducts$      searchTerm$       pageSize$
                    │               │               │
                    └───────┬───────┘               │
                            ▼                       │
                    filteredProducts$               │
                            │                       │
                            └───────────┬───────────┘
                                        ▼
                                paginatedProducts$
                                        │
                                        ▼
                              ProductListPage
                              (async pipe → ProductTableComponent)

ProductSearchComponent.searchChange ──► state.setSearchTerm(term)
                                        (resetea página a 1 automáticamente)
```

#### Lógica de Búsqueda (ya en ProductStateService)

```typescript
// product-list.page.ts
onSearch(term: string): void {
  this.productStateService.setSearchTerm(term);
}
```

> La lógica de filtrado vive en `ProductStateService.filterProducts()` — no se duplica en la página.

### Consideraciones de Estilo (D1)
- El campo de búsqueda está en la barra superior (header azul), a la derecha del logo "BANCO".
- Placeholder: "Search..." en texto gris claro.
- Ícono de lupa opcional a la izquierda del input.
- Input con borde redondeado, fondo blanco, altura ~36px.

---

## 3. LISTA DE TAREAS

### Frontend — Implementación

#### Componente — ProductSearch
- [ ] Crear `product-search.component.ts` (standalone)
- [ ] Implementar `@Input() placeholder = 'Search...'`
- [ ] Implementar `@Output() searchChange = new EventEmitter<string>()`
- [ ] Aplicar debounce de 300ms con RxJS (`debounceTime`, `distinctUntilChanged`)
- [ ] Emitir término con `trim()` aplicado
- [ ] Usar `FormControl` reactivo para el input
- [ ] Crear estilos SCSS: input con borde redondeado, placeholder gris, alineado a la derecha

```typescript
// Ejemplo de implementación
searchControl = new FormControl('', { nonNullable: true });

ngOnInit() {
  this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
  ).subscribe((term) => {
    this.searchChange.emit(term);
  });
}
```

#### Página — ProductListPage (modificaciones)
- [ ] Agregar propiedad `allProducts: Product[]` — almacenar datos originales
- [ ] Agregar propiedad `filteredProducts: Product[]` — datos filtrados
- [ ] Implementar método `onSearch(term: string)` — filtrar `allProducts` → `filteredProducts`
- [ ] Conectar `@Output(searchChange)` del `ProductSearchComponent` a `onSearch()`
- [ ] Pasar `filteredProducts` al `ProductTableComponent` en lugar de `allProducts`
- [ ] Actualizar lógica de contador para reflejar `filteredProducts.length`

#### Core
- [ ] Verificar que `ProductService.getAll()` retorna datos crudos para `allProducts`

### Tests — Jest

#### ProductSearchComponent
- [ ] `should render search input with placeholder` — verificar placeholder
- [ ] `should emit search term after debounce` — escribir, avanzar 300ms, verificar emit
- [ ] `should trim search term before emitting` — escribir "  test  ", verificar "test"
- [ ] `should not emit duplicate consecutive terms` — verificar distinctUntilChanged
- [ ] `should emit empty string when input is cleared` — borrar, verificar emit('')

#### ProductListPage (modificaciones)
- [ ] `should filter products by name when search term changes` — mock productos, emitir término, verificar filtro
- [ ] `should filter products by description when search term changes`
- [ ] `should show all products when search term is empty` — emitir '', verificar array completo
- [ ] `should show empty state when no products match search` — emitir término sin coincidencias
- [ ] `should reset filter when search is cleared`

### QA
- [ ] Ejecutar `/gherkin-case-generator` para HU-02
- [ ] Ejecutar `/risk-identifier` para SPEC-002
- [ ] Verificar integración con SPEC-001 (no rompe listado existente)
- [ ] Verificar debounce en navegador (prueba manual)
- [ ] Validar visualmente contra Diseño D1 (barra de búsqueda)
