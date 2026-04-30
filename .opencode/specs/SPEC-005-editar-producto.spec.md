---
id: SPEC-005
status: IMPLEMENTED
feature: f5-editar-producto
created: 2026-04-29
updated: 2026-04-29
author: spec-generator
version: "1.0"
dependencies: [SPEC-001, SPEC-004]
related-specs: []
---

# Spec: F5 — Editar Producto Financiero

> **Estado:** `IMPLEMENTED`
> **Diseño de referencia:** D2 (Formulario), D3 (Menú contextual)
> **Tipo:** Deseable (SemiSenior)
> **Depende de:** SPEC-001 (tabla con productos), SPEC-004 (formulario y validaciones)

---

## 1. REQUERIMIENTOS

### Descripción
Funcionalidad que permite editar un producto existente desde el listado. El operador abre un menú contextual (dropdown) en la fila del producto, selecciona "Editar", y es redirigido al formulario precargado con los datos actuales del producto. El campo ID aparece deshabilitado. Las validaciones son idénticas a las de creación (SPEC-004), excepto que no se valida la unicidad del ID. Al guardar, se consume `PUT /bp/products/:id` para actualizar el producto.

### Requerimiento de Negocio
Fuente: `.opencode/requirements/productos-financieros.md` — F5

### Historias de Usuario

#### HU-05: Editar un producto existente

```
Como:        Operador bancario
Quiero:      modificar los datos de un producto financiero existente
Para:        mantener actualizada la información del catálogo sin tener que eliminar y recrear

Prioridad:   Media
Estimación:  M
Dependencias: HU-01 (SPEC-001), HU-04 (SPEC-004)
Capa:        Frontend
```

#### Criterios de Aceptación — HU-05

**Happy Path**
```gherkin
CRITERIO-5.1: Abrir menú contextual en fila de producto
  Dado que:  la tabla muestra productos en /products
  Cuando:    el operador hace clic en el icono de menú (⋮) de una fila
  Entonces:  se despliega un menú contextual con las opciones: "Editar" y "Eliminar"
  Y:         el menú se posiciona junto a la fila
  Y:         el menú se cierra al hacer clic fuera de él
```

**Happy Path**
```gherkin
CRITERIO-5.2: Navegar a formulario de edición
  Dado que:  el menú contextual está abierto en un producto
  Cuando:    el operador selecciona "Editar"
  Entonces:  navega a /products/edit/{id}
  Y:         el formulario se muestra con los campos precargados:
            - ID: valor actual (deshabilitado)
            - Nombre: valor actual
            - Descripción: valor actual
            - Logo: valor actual
            - Fecha de Liberación: valor actual
            - Fecha de Revisión: calculada automáticamente
  Y:         el título del formulario indica que se está editando
```

**Happy Path**
```gherkin
CRITERIO-5.3: Actualizar producto exitosamente
  Dado que:  el operador está en /products/edit/{id}
  Y:         modifica uno o más campos con datos válidos
  Cuando:    presiona el botón "Agregar" (o "Guardar")
  Entonces:  se envía PUT /bp/products/{id} con los datos modificados
  Y:         el backend responde con { message: "Product updated successfully", data: {...} }
  Y:         se muestra un mensaje de éxito
  Y:         se redirige a /products
  Y:         el producto refleja los cambios en la tabla
```

**Error Path**
```gherkin
CRITERIO-5.4: Campo ID deshabilitado en edición
  Dado que:  el operador está en /products/edit/{id}
  Cuando:    intenta modificar el campo ID
  Entonces:  el campo ID está deshabilitado y no permite edición
  Y:         no se ejecuta validación asíncrona de ID único
```

**Error Path**
```gherkin
CRITERIO-5.5: Validaciones idénticas a creación
  Dado que:  el operador está en /products/edit/{id}
  Cuando:    modifica el nombre a 3 caracteres
  Entonces:  se muestra error: "El nombre debe tener entre 5 y 100 caracteres"
  Y:         las mismas validaciones de SPEC-004 aplican (excepto unicidad de ID)
```

**Error Path**
```gherkin
CRITERIO-5.6: Error del backend al actualizar
  Dado que:  el operador modificó datos en el formulario de edición
  Cuando:    presiona "Agregar" y el backend falla (error 400/404/500)
  Entonces:  se muestra un mensaje de error general debajo del formulario
  Y:         el formulario permanece visible con los datos ingresados
  Y:         el botón Agregar se rehabilita para reintentar
```

**Error Path**
```gherkin
CRITERIO-5.7: Producto no encontrado para editar
  Dado que:  el operador navega a /products/edit/id-que-no-existe
  Cuando:    la página intenta cargar el producto vía GET /bp/products/{id}
  Entonces:  el backend responde 404
  Y:         se muestra mensaje: "Producto no encontrado"
  Y:         se ofrece un enlace para volver al listado
```

**Edge Case**
```gherkin
CRITERIO-5.8: Menú contextual — solo un menú abierto a la vez
  Dado que:  el menú contextual de la fila 1 está abierto
  Cuando:    el operador hace clic en el icono de menú de la fila 2
  Entonces:  el menú de la fila 1 se cierra
  Y:         el menú de la fila 2 se abre
```

**Edge Case**
```gherkin
CRITERIO-5.9: Editar sin cambios — submit con datos originales
  Dado que:  el operador está en /products/edit/{id}
  Y:         no modifica ningún campo
  Cuando:    presiona "Agregar"
  Entonces:  igual se envía PUT al backend con los datos originales
  Y:         el backend actualiza exitosamente (idempotente)
  Y:         se redirige al listado
```

### Reglas de Negocio
1. El campo `id` está deshabilitado en modo edición (no se puede modificar el identificador).
2. No se ejecuta validación asíncrona de ID único en modo edición.
3. El `date_revision` se recalcula automáticamente si cambia `date_release`.
4. Las validaciones de longitud y requeridos son idénticas a SPEC-004.
5. Al cargar la página, se obtiene el producto vía `GET /bp/products/:id` para precargar el formulario.
6. El botón de submit en edición debe decir "Agregar" (según la prueba) o "Guardar" — se usa el mismo texto que en creación.
7. El endpoint de actualización es `PUT /bp/products/:id`. El body puede contener solo los campos modificados (el backend hace merge).

---

## 2. DISEÑO

### API — Endpoints consumidos

| Método | Ruta | Body / Params | Response | Cuándo |
|--------|------|---------------|----------|--------|
| `GET` | `/bp/products/:id` | — | `Product` | Al cargar formulario de edición |
| `PUT` | `/bp/products/:id` | `Partial<Product>` | `{ message, data }` | Al guardar cambios |

### Arquitectura Frontend

#### Estructura de archivos a crear/modificar

```
src/app/
├── features/
│   └── products/
│       ├── pages/
│       │   ├── product-list/
│       │   │   └── product-list.page.ts         ← [MODIFICAR] Manejar evento edit → router.navigate
│       │   └── product-form/
│       │       └── product-form.page.ts         ← [MODIFICAR] Modo edición (OnPush, takeUntil)
│       └── components/
│           ├── product-form/
│           │   └── product-form.component.ts    ← [MODIFICAR] Precargar datos (OnPush), deshabilitar ID
│           └── product-menu/
│               ├── product-menu.component.ts    ← [NUEVO] Dumb component (OnPush) D3
│               ├── product-menu.component.scss  ← [NUEVO] Estilos
│               └── product-menu.component.html  ← [NUEVO] Template
└── shared/
    └── components/
        └── product-table/
            └── product-table.component.ts       ← [MODIFICAR] Incluir menú por fila
```

#### Componentes

| Componente | Selector | Inputs | Outputs | Descripción |
|------------|----------|--------|---------|-------------|
| `ProductMenuComponent` | `app-product-menu` | `productId: string` | `edit: EventEmitter<string>`, `delete: EventEmitter<string>` | Dumb component con `OnPush`. Menú dropdown D3. Un solo menú abierto a la vez. |

> Nota: Se reutilizan `PRODUCT_VALIDATORS`, `PRODUCT_ERROR_MESSAGES`, `DateUtil`, `DateDisplayPipe` de specs anteriores (DRY).

#### Modificaciones a componentes existentes

| Archivo | Cambio |
|---------|--------|
| `product-table.component.ts` | Agregar columna de acciones con `<app-product-menu>` por fila. |
| `product-table.component.html` | Incluir botón ⋮ que abre el menú. |
| `product-form.component.ts` | Aceptar `@Input() product: Product \| null`. Si no es null, precargar formulario con `patchValue()`. Deshabilitar campo `id` en modo edición. No ejecutar validador asíncrono de ID si estamos en edición. |
| `product-form.page.ts` | Detectar si hay `:id` en la ruta para modo edición. Cargar producto vía `ProductService.getById(id)`. Pasar producto al `ProductFormComponent`. Al recibir `formSubmit`, llamar a `update()` en vez de `create()`. |
| `product-list.page.ts` | Manejar evento `edit` del `ProductMenuComponent` → `router.navigate(['/products/edit', id])`. |

#### Flujo de Navegación

```
ProductListPage (/products)
  ├── [Botón Agregar] ──────────────► /products/add (modo creación)
  └── [Menú ⋮ → Editar] ───────────► /products/edit/{id} (modo edición)
                                        │
                                        ├── Carga producto vía GET /bp/products/:id
                                        ├── Precarga formulario con patchValue()
                                        ├── ID deshabilitado
                                        └── Al guardar → PUT /bp/products/:id
                                             └── Redirige a /products
```

#### Lógica de Edición en ProductFormPage (OnPush + takeUntil + ApiError tipado)

```typescript
// product-form.page.ts
@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [ProductFormComponent, CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,  // Rendimiento
})
export class ProductFormPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();  // SOLID: cleanup
  isEditMode = false;
  productId: string | null = null;
  product$ = new BehaviorSubject<Product | null>(null);
  error$ = new BehaviorSubject<string | null>(null);
  submitting$ = new BehaviorSubject<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.productService.getById(this.productId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (product) => this.product$.next(product),
          error: (err: ApiError) => this.error$.next(err.message),
        });
    }
  }

  onFormSubmit(data: Product): void {
    this.submitting$.next(true);
    const request$ = this.isEditMode
      ? this.productService.update(this.productId!, data)
      : this.productService.create(data);

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err: ApiError) => {
          this.error$.next(err.message);
          this.submitting$.next(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Rutas (app.routes.ts)

```typescript
{
  path: 'products/edit/:id',
  loadComponent: () => import('./features/products/pages/product-form/product-form.page')
    .then(m => m.ProductFormPage),
},
```

### Consideraciones de Estilo (D3 — Menú)

- Icono de tres puntos verticales (⋮) en cada fila, alineado a la derecha.
- Al hacer clic, despliega un dropdown con opciones "Editar" y "Eliminar".
- Dropdown con borde sutil, sombra, fondo blanco.
- Opción "Editar" con texto negro, hover con fondo gris claro.
- Opción "Eliminar" (para SPEC F6 — fuera de alcance, pero visible como placeholder).
- El menú se cierra al hacer clic fuera (usar `@HostListener('document:click')` o CDK overlay).

---

## 3. LISTA DE TAREAS

### Frontend — Implementación

#### Componente — ProductMenu
- [ ] Crear `product-menu.component.ts` (standalone)
- [ ] Implementar `@Input() productId: string`
- [ ] Implementar `@Output() edit = new EventEmitter<string>()`
- [ ] Implementar `@Output() delete = new EventEmitter<string>()`
- [ ] Renderizar botón ⋮ (tres puntos) para abrir/cerrar menú
- [ ] Renderizar dropdown con opciones "Editar" y "Eliminar"
- [ ] Implementar toggle abrir/cerrar al hacer clic en ⋮
- [ ] Cerrar menú al hacer clic fuera (`document:click` listener)
- [ ] Cerrar menú al seleccionar una opción
- [ ] Emitir `edit.emit(productId)` al hacer clic en "Editar"
- [ ] Emitir `delete.emit(productId)` al hacer clic en "Eliminar" (placeholder para F6)
- [ ] Crear estilos SCSS según Diseño D3

#### Modificación — ProductTableComponent
- [ ] Agregar columna de acciones (sin header, solo icono ⋮)
- [ ] Incluir `<app-product-menu [productId]="product.id">` en cada fila
- [ ] Ajustar estilos de la columna de acciones (ancho fijo ~40px)
- [ ] Conectar `@Output(edit)` del menu al padre para navegación

#### Modificación — ProductListPage
- [ ] Manejar evento `edit` del menú → `router.navigate(['/products/edit', id])`

#### Modificación — ProductFormComponent
- [ ] Agregar `@Input() product: Product | null = null`
- [ ] En `ngOnInit` / `ngOnChanges`: si `product` no es null, `patchValue(product)`
- [ ] Si `@Input() product` no es null, deshabilitar campo `id` (`this.form.get('id')?.disable()`)
- [ ] Si `@Input() product` no es null, no ejecutar validador asíncrono de ID
- [ ] El `@Output() formSubmit` debe emitir `this.form.getRawValue()` para incluir campos disabled
- [ ] Ajustar cálculo de `date_revision` también en precarga

#### Modificación — ProductFormPage
- [ ] Inyectar `ActivatedRoute` para obtener `:id` de la URL
- [ ] Detectar modo edición: si `route.snapshot.paramMap.get('id')` existe
- [ ] En modo edición: llamar `ProductService.getById(id)`, pasar resultado al `ProductFormComponent`
- [ ] Manejar caso de producto no encontrado (404) → mensaje + link a `/products`
- [ ] En modo edición: al submit, llamar `ProductService.update(id, data)` en vez de `create()`
- [ ] Ajustar título de la página según modo ("Nuevo Producto" vs "Editar Producto")
- [ ] Ajustar mensaje de éxito ("Producto creado" vs "Producto actualizado")

#### Rutas
- [ ] Registrar ruta `/products/edit/:id` en `app.routes.ts`

#### Core
- [ ] Agregar `getById(id: string): Observable<Product>` en `ProductService` si no existe
- [ ] Agregar `update(id: string, product: Partial<Product>): Observable<{ message, data }>` en `ProductService` si no existe

### Tests — Jest

#### ProductMenuComponent
- [ ] `should render menu trigger button (⋮)` — verificar botón ⋮
- [ ] `should open dropdown when trigger is clicked` — clic en ⋮, verificar dropdown visible
- [ ] `should emit edit event when "Editar" is clicked` — abrir menú, clic en Editar, verificar emit
- [ ] `should emit delete event when "Eliminar" is clicked` — verificar emit (placeholder)
- [ ] `should close dropdown when option is selected` — seleccionar opción, verificar menú cerrado
- [ ] `should close dropdown when clicking outside` — clic fuera, verificar menú cerrado
- [ ] `should only have one menu open at a time` — abrir menú 1, abrir menú 2, verificar menú 1 cerrado

#### ProductFormComponent (modificaciones)
- [ ] `should prefill form when product input is provided` — pasar @Input product, verificar patchValue
- [ ] `should disable id field in edit mode` — pasar @Input product, verificar id.disabled
- [ ] `should not run async id validation in edit mode` — verificar que no se llama verifyId
- [ ] `should emit formSubmit with getRawValue() in edit mode` — submit con id disabled, verificar datos
- [ ] `should still auto-calculate date_revision in edit mode` — cambiar date_release, verificar

#### ProductFormPage (modificaciones)
- [ ] `should load product on init when editing` — mock ActivatedRoute con :id, verificar getById llamado
- [ ] `should show error when product not found` — mock getById error 404, verificar mensaje
- [ ] `should call update on submit in edit mode` — mock update, emitir submit, verificar llamada
- [ ] `should navigate to /products after successful update` — mock success, verificar router.navigate
- [ ] `should call create on submit in create mode` — sin :id, verificar create llamado

#### ProductTableComponent (modificaciones)
- [ ] `should render ProductMenu in each row` — verificar app-product-menu por fila

### QA
- [ ] Ejecutar `/gherkin-case-generator` para HU-05
- [ ] Ejecutar `/risk-identifier` para SPEC-005
- [ ] Probar manualmente: editar producto, verificar cambios
- [ ] Probar: menú abre/cierra correctamente, solo uno a la vez
- [ ] Probar: ID deshabilitado, validaciones activas
- [ ] Validar visualmente contra Diseño D2 (edición), D3 (menú)
- [ ] Verificar build sin errores
