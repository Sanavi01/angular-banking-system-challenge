---
id: SPEC-001
status: IMPLEMENTED
feature: f1-listado-productos
created: 2026-04-29
updated: 2026-04-29
author: spec-generator
version: "1.0"
dependencies: []
related-specs: [SPEC-002, SPEC-003]
---

# Spec: F1 — Listado de Productos Financieros

> **Estado:** `IMPLEMENTED`
> **Diseño de referencia:** D1 (Listado)
> **Tipo:** Requerido

---

## 1. REQUERIMIENTOS

### Descripción
Pantalla principal que consulta el endpoint `GET /bp/products` y muestra todos los productos financieros en una tabla. Es la vista de entrada de la aplicación y la base sobre la que se construyen el resto de funcionalidades (búsqueda, paginación, acciones por producto).

### Requerimiento de Negocio
Fuente: `.opencode/requirements/productos-financieros.md` — F1

### Historias de Usuario

#### HU-01: Visualizar listado de productos financieros

```
Como:        Operador bancario
Quiero:      ver una tabla con todos los productos financieros disponibles
Para:        consultar rápidamente el catálogo de productos del banco

Prioridad:   Alta
Estimación:  M
Dependencias: Ninguna
Capa:        Frontend
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: Mostrar tabla con productos desde la API
  Dado que:  el backend está disponible en http://localhost:3002
  Y:         existe al menos un producto en la base de datos
  Cuando:    el operador accede a la ruta /products
  Entonces:  se renderiza una tabla HTML con las siguientes columnas en orden:
             Logo | Nombre del producto | Descripción | Fecha de liberación | Fecha de reestructuración
  Y:         cada fila contiene los datos reales del producto desde la API
  Y:         el logo se muestra como una imagen circular (40x40px) con la URL del campo logo
  Y:         las fechas se muestran en formato DD/MM/YYYY
  Y:         los encabezados de columna "Descripción", "Fecha de liberación" y
             "Fecha de reestructuración" incluyen un icono de información (ℹ️)
```

**Error Path**
```gherkin
CRITERIO-1.2: Backend no disponible — error de conexión
  Dado que:  el backend no está en ejecución o no responde
  Cuando:    el operador accede a /products
  Entonces:  se muestra un mensaje de error visible en el área de contenido:
             "Error al cargar los productos. Verifique que el servidor esté en ejecución."
  Y:         no se renderiza la tabla
  Y:         no se rompe el layout de la página (header y controles permanecen)
```

**Edge Case**
```gherkin
CRITERIO-1.3: Listado vacío — sin productos en la API
  Dado que:  el backend responde exitosamente con { data: [] }
  Cuando:    el operador accede a /products
  Entonces:  se muestra un estado vacío con el mensaje:
             "No se encontraron productos financieros."
  Y:         no se renderizan filas en la tabla
  Y:         los controles de búsqueda y paginación permanecen visibles pero sin efecto
```

### Reglas de Negocio
1. La tabla debe consultar `GET /bp/products` al cargar la página.
2. Las columnas deben mostrarse en el orden: Logo, Nombre, Descripción, Fecha de Liberación, Fecha de Revisión.
3. Las fechas se reciben en formato ISO `YYYY-MM-DD` desde la API y se muestran en `DD/MM/YYYY`.
4. El logo se renderiza como `<img>` circular; si la URL falla, mostrar placeholder con inicial del nombre.
5. Los íconos ℹ️ en los headers son decorativos (tooltip opcional).
6. La tabla debe manejar estado de carga (loading) mientras espera la respuesta de la API.

---

## 2. DISEÑO

### API — Endpoint consumido

| Método | Ruta | Response |
|--------|------|----------|
| `GET` | `/bp/products` | `{ data: Product[] }` |

### Modelo de Datos (TypeScript)

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;  // YYYY-MM-DD
  date_revision: string;  // YYYY-MM-DD
}
```

### Arquitectura Frontend

#### Estructura de archivos a crear/modificar

```
src/app/
├── core/
│   ├── interceptors/
│   │   └── error.interceptor.ts          ← [NUEVO] Interceptor HTTP global (SOLID: SRP)
│   ├── models/
│   │   ├── product.model.ts              ← [NUEVO] Interfaz Product
│   │   └── api-error.model.ts            ← [NUEVO] Interfaz ApiError tipada
│   └── services/
│       └── product.service.ts            ← [NUEVO] Método getAll() retorna Product[]
├── features/
│   └── products/
│       ├── pages/
│       │   └── product-list/
│       │       ├── product-list.page.ts  ← [NUEVO] Smart page (orquesta, OnPush)
│       │       ├── product-list.page.scss← [NUEVO] Estilos D1
│       │       └── product-list.page.html← [NUEVO] Template
│       └── services/
│           └── product-state.service.ts  ← [NUEVO] Facade RxJS (SRP, estado centralizado)
└── shared/
    ├── components/
    │   └── product-table/
    │       ├── product-table.component.ts    ← [NUEVO] Dumb component (OnPush)
    │       ├── product-table.component.scss  ← [NUEVO] Estilos de tabla
    │       └── product-table.component.html  ← [NUEVO] Template
    └── pipes/
        └── date-display.pipe.ts          ← [NUEVO] Pipe YYYY-MM-DD → DD/MM/YYYY (DRY)
```

#### Componentes

| Componente | Selector | Inputs | Outputs | Descripción |
|------------|----------|--------|---------|-------------|
| `ProductTableComponent` | `app-product-table` | `products: Product[]`, `loading: boolean`, `error: string \| null` | — | Dumb component con `OnPush`. Renderiza tabla con columnas y `dateDisplay` pipe. |

#### Páginas

| Página | Ruta | Responsabilidad |
|--------|------|-----------------|
| `ProductListPage` | `/products` | Smart page con `OnPush`. Inyecta `ProductService` + `ProductStateService`. Carga productos → `state.setProducts()`. Expone observables `state.paginatedProducts$` al template via `async` pipe. Maneja `takeUntil` para unsubscribe. |

#### Servicios

| Servicio | Método | Retorno | Capa |
|----------|--------|---------|------|
| `ProductService` | `getAll(): Observable<Product[]>` | Lista de productos | Core — HTTP |
| `ProductStateService` | `setProducts()`, `paginatedProducts$`, `totalFiltered$` | Observables reactivos | Feature — Estado |

#### Layout de la Página (Diseño D1)

```
┌──────────────────────────────────────────────────────┐
│  [BANCO]                              Search...      │  ← Header (barra azul con logo + search placeholder)
├──────────────────────────────────────────────────────┤
│  Logo │ Nombre del producto │ Descripción ℹ️ │       │
│       │                     │ Fecha lib. ℹ️   │       │
│       │                     │ Fecha reest. ℹ️ │       │
├───────┼─────────────────────┼─────────────────┤───────┤
│  ●    │ Nombre del producto │ Descripción     │01/01/ │
│       │                     │                 │2000   │
│       │                     │                 │01/01/ │
│       │                     │                 │2001   │
├───────┼─────────────────────┼─────────────────┼───────┤
│  ...  │ ...                 │ ...             │ ...   │
├───────┴─────────────────────┴─────────────────┴───────┤
│  5 resultados                          [5 ▾]         │  ← Footer con contador + select
└──────────────────────────────────────────────────────┘
```

> Nota: Los controles de búsqueda y paginación se implementan en SPEC-002 y SPEC-003 respectivamente. En esta spec solo se asegura el espacio visual (placeholders) para ellos en la página.

### Rutas (app.routes.ts)

```typescript
{
  path: '',
  redirectTo: '/products',
  pathMatch: 'full',
},
{
  path: 'products',
  loadComponent: () => import('./features/products/pages/product-list/product-list.page')
    .then(m => m.ProductListPage),
},
```

### Consideraciones de Estilo (D1)
- Encabezado azul corporativo con logo "BANCO" a la izquierda.
- Tabla con bordes sutiles, filas alternadas en gris claro.
- Logo circular con borde, 40x40px.
- Texto de columnas en negrita, color oscuro.
- Ícono ℹ️ en gris claro junto a los headers indicados.
- Sin frameworks CSS: todo en SCSS puro.

---

## 3. LISTA DE TAREAS

### Frontend — Implementación

#### Core
- [x] Crear `product.model.ts` — interfaz `Product`
- [x] Crear `api-error.model.ts` — interfaz `ApiError { message: string }`
- [x] Crear `product.service.ts` — método `getAll()` retorna `Observable<Product[]>`
- [x] Crear `error.interceptor.ts` — interceptor HTTP global (SOLID: SRP)
- [x] Registrar `ErrorInterceptor` en `main.ts` con `HTTP_INTERCEPTORS`
- [x] Configurar `environment.ts` con `apiUrl` (dev con proxy, prod: `http://localhost:3002`)

#### Servicio — ProductStateService (SRP)
- [x] Crear `product-state.service.ts` — facade de estado RxJS
- [x] Implementar `allProducts$`, `searchTerm$`, `pageSize$`, `currentPage$` (BehaviorSubjects)
- [x] Implementar `filteredProducts$` (combineLatest + filtro)
- [x] Implementar `paginatedProducts$` (combineLatest + slice)
- [x] Implementar `totalFiltered$` (filteredProducts.length)
- [x] Implementar `totalPages$` (adicional — no pedido pero útil)
- [x] Implementar métodos: `setProducts()`, `setSearchTerm()`, `setPageSize()`, `setPage()`
- [x] Implementar `OnDestroy` con `destroy$` para cleanup

#### Shared
- [x] Crear `date-display.pipe.ts` — pipe `YYYY-MM-DD → DD/MM/YYYY` standalone (DRY)

#### Componente — ProductTable (Dumb, OnPush)
- [x] Crear `product-table.component.ts` (standalone, `OnPush`)
- [x] Implementar `@Input() products: Product[]`
- [x] Implementar `@Input() loading: boolean`
- [x] Implementar `@Input() error: string | null`
- [x] Renderizar columnas: Logo (img circular), Nombre, Descripción, date_release con `dateDisplay` pipe, date_revision con `dateDisplay` pipe
- [x] Mostrar placeholder de logo si la imagen falla (evento `onerror`)
- [x] Agregar íconos ℹ️ en headers: Descripción, Fecha de Liberación, Fecha de Reestructuración
- [x] Crear estilos SCSS según Diseño D1 (header azul, filas alternadas, logo circular 40px, borde sutil)

#### Página — ProductListPage (Smart, OnPush)
- [x] Crear `product-list.page.ts` (standalone, `OnPush`)
- [x] Inyectar `ProductService` + `ProductStateService`
- [x] En `ngOnInit`: cargar productos → `state.setProducts()`, suscribir con `takeUntil(destroy$)`
- [x] Exponer `state.paginatedProducts$` al template via `async` pipe
- [x] Exponer `state.totalFiltered$` para el contador
- [x] Manejar estado loading con variable local `loading$`
- [x] Manejar estado error con variable local `error$` (ErrorInterceptor ya tipa el error)
- [x] Pasar observables al `ProductTableComponent` via `async` pipe
- [x] Incluir header "BANCO" con logo (hardcodeado)
- [x] Dejar placeholder visual para barra de búsqueda (SPEC-002)
- [x] Dejar placeholder visual para paginación (SPEC-003)
- [x] Implementar `OnDestroy` con `destroy$.next() + destroy$.complete()`
- [x] Crear estilos SCSS según Diseño D1

#### Rutas
- [x] Registrar ruta `/products` con lazy loading en `app.routes.ts`
- [x] Configurar redirect de `/` → `/products`

### Tests — Jest

#### ProductService
- [x] `should fetch all products successfully` — mock HttpTestingController, verificar GET y retorno
- [x] `should handle HTTP error` — simular error 500, verificar manejo en componente
- [x] `should return empty array when backend returns empty data` — adicional
- [x] `should handle HTTP 404 error` — adicional
- [x] `should fetch a product by id successfully` — adicional
- [x] `should create a product successfully` — adicional
- [x] `should handle 400 error on create (duplicate id)` — adicional
- [x] `should update a product successfully` — adicional
- [x] `should delete a product successfully` — adicional
- [x] `should verify that an id exists` — adicional
- [x] `should verify that an id does not exist` — adicional

#### ProductTableComponent
- [x] `should render table with correct columns` — verificar headers
- [x] `should render product rows with correct data` — verificar nombre, descripción, fechas
- [x] `should format dates as DD/MM/YYYY` — verificar transformación de fecha
- [x] `should render logo image with correct src` — verificar atributo src
- [x] `should show placeholder when logo fails to load` — disparar evento onerror
- [x] `should show loading state when loading is true` — verificar indicador
- [x] `should show empty state when products array is empty` — verificar mensaje
- [x] `should show error message when error is provided` — verificar mensaje de error
- [x] `should apply alternating row style` — adicional
- [x] `should render info icons on headers` — adicional
- [x] `should display product initial in placeholder` — adicional

#### ProductListPage
- [x] `should load products on init` — mock ProductService, verificar llamada
- [x] `should pass products to ProductTableComponent` — verificar @Input binding (implícito via template)
- [x] `should show loading state initially` — verificar estado antes de resolver
- [x] `should show error state on service failure` — mock error, verificar mensaje
- [x] `should render header with brand name` — adicional
- [x] `should render search placeholder` — adicional
- [x] `should render footer with results text` — adicional
- [x] `should render page size select` — adicional
- [x] `should complete destroy$ on destroy` — adicional

### QA
- [ ] Ejecutar `/gherkin-case-generator` para HU-01
- [ ] Ejecutar `/risk-identifier` para SPEC-001
- [x] Verificar cobertura de tests ≥ 70% (71.77% statements, 72.64% lines)
- [x] Verificar build sin errores (`ng build`)
- [ ] Validar visualmente contra Diseño D1
