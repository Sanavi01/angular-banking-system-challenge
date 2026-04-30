# Financial Products App — Sistema Bancario

Aplicación web para la gestión de productos financieros. CRUD completo con listado, búsqueda, paginación, formulario de registro/edición y validaciones en tiempo real. Construida bajo los principios **ASDD** (Agent Spec-Driven Development).

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 17 (standalone components) |
| Lenguaje | TypeScript 5.4 |
| Estilos | **SCSS puro** — sin frameworks CSS |
| HTTP | `@angular/common/http` con `ErrorInterceptor` global |
| Estado | RxJS 7.8 — `ProductStateService` como facade reactivo |
| Router | Angular Router con lazy loading |
| Testing | Jest 29 (`jest-preset-angular` v14) |
| Backend | Express + TypeScript (API REST local en `localhost:3002`) |
| Metodología | ASDD — specs aprobadas antes de implementar |

---

## Cómo levantar el proyecto

### 1. Backend (API REST local)

```bash
# Descomprimir y entrar al backend
unzip repo-interview-main.zip -d backend
cd backend
npm install
npm run start:dev
```

El servidor queda en `http://localhost:3002`.

**Endpoints disponibles:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/bp/products` | Listar productos |
| `POST` | `/bp/products` | Crear producto |
| `PUT` | `/bp/products/:id` | Actualizar producto |
| `DELETE` | `/bp/products/:id` | Eliminar producto |
| `GET` | `/bp/products/verification/:id` | Verificar si un ID existe |

### 2. Frontend (Angular)

```bash
cd financial-products-app
npm install
npm start          # Desarrollo en http://localhost:4200
```

**Comandos disponibles:**

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm test` | Ejecutar tests unitarios |
| `npm run test:coverage` | Tests + reporte de cobertura |

---

## Estructura del proyecto

```
financial-products-app/src/app/
├── core/                              ← Singleton, app-wide
│   ├── interceptors/
│   │   └── error.interceptor.ts       ← Transforma errores HTTP en ApiError
│   ├── models/
│   │   ├── product.model.ts           ← Interfaz Product
│   │   └── api-error.model.ts         ← Tipo ApiError
│   └── services/
│       └── product.service.ts         ← Llamadas HTTP al backend
├── features/products/
│   ├── components/
│   │   ├── product-form/              ← Dumb: formulario reactivo
│   │   └── product-menu/              ← Dumb: menú contextual (⋮)
│   ├── pages/
│   │   ├── product-list/              ← Smart: listado + búsqueda + paginación
│   │   └── product-form/              ← Smart: orquesta create/update
│   └── services/
│       └── product-state.service.ts   ← Facade RxJS del estado del listado
├── shared/
│   ├── components/
│   │   ├── product-table/             ← Dumb: tabla de productos
│   │   ├── product-search/            ← Dumb: input de búsqueda
│   │   └── product-pagination/        ← Dumb: resultados + navegación + selector
│   ├── pipes/
│   │   └── date-display.pipe.ts       ← YYYY-MM-DD → DD/MM/YYYY
│   ├── utils/
│   │   └── date.util.ts               ← addOneYear(), toDisplay()
│   └── validators/
│       ├── product-validators.ts      ← Constantes de validación DRY
│       ├── date-not-past.validator.ts ← Validación fecha ≥ hoy
│       └── id-exists.validator.ts     ← Validación asíncrona ID único
└── app.routes.ts                      ← Rutas con lazy loading
```

### Arquitectura: Smart / Dumb

```
Smart Page                     Dumb Component
┌──────────────────┐           ┌──────────────────┐
│ Inyecta servicios │──@Input──→│ Solo recibe props │
│ Orquesta estado   │←@Output──│ Solo emite eventos│
│ NO lógica render  │           │ NO llama APIs     │
└──────────────────┘           └──────────────────┘
```

---

## Funcionalidades implementadas

| Feature | Descripción |
|---------|-------------|
| **F1 — Listado** | Tabla con Logo, Nombre, Descripción, Fechas. Estados: loading, error, empty |
| **F2 — Búsqueda** | Campo de texto con debounce de 300ms. Filtro por nombre y descripción |
| **F3 — Paginación** | Contador de resultados. Selector de 5, 10 o 20 registros. Navegación entre páginas |
| **F4 — Agregar** | Formulario reactivo con validaciones completas. `date_revision` = `date_release` + 1 año |
| **F5 — Editar** | Menú contextual (⋮) por producto. ID deshabilitado en edición. Mismas validaciones |
| **Validaciones** | ID único (API), 3-10 chars. Nombre 5-100. Descripción 10-200. Fecha ≥ hoy |

---

## Tests y Coverage

```bash
npm test              # Ejecutar tests
npm run test:coverage # Tests + reporte de cobertura
```

| Métrica | Cobertura |
|---------|:---------:|
| Statements | **92.73%** |
| Branches | **92.3%** |
| Functions | **85.22%** |
| Lines | **94.2%** |
| Test suites | **16** (160 tests) |

---

## Principios aplicados

- **SOLID** — Single Responsibility, Open/Closed, Dependency Inversion
- **DRY** — Validaciones, fechas y mensajes de error centralizados
- **Smart/Dumb** — Páginas orquestan, componentes renderizan
- **OnPush** — Change detection en todos los componentes
- **Unsubscribe** — `takeUntil(destroy$)` en toda suscripción
- **0 frameworks CSS** — Solo SCSS puro
