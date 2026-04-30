---
id: SPEC-004
status: IMPLEMENTED
feature: f4-agregar-producto
created: 2026-04-29
updated: 2026-04-29
author: spec-generator
version: "1.0"
dependencies: [SPEC-001]
related-specs: [SPEC-005]
---

# Spec: F4 — Agregar Producto Financiero

> **Estado:** `IMPLEMENTED`
> **Diseño de referencia:** D2 (Formulario), D3 (Botón Agregar)
> **Tipo:** Requerido
> **Depende de:** SPEC-001 (ruta `/products`, ProductService base)

---

## 1. REQUERIMIENTOS

### Descripción
Formulario de creación de un nuevo producto financiero. El operador accede mediante un botón "Agregar" en la página de listado, completa los campos requeridos con sus validaciones, y al enviar se consume `POST /bp/products` para registrar el producto en el sistema. Tras el registro exitoso, se redirige al listado.

### Requerimiento de Negocio
Fuente: `.opencode/requirements/productos-financieros.md` — F4

### Historias de Usuario

#### HU-04: Agregar un nuevo producto financiero

```
Como:        Operador bancario
Quiero:      registrar un nuevo producto financiero mediante un formulario
Para:        incorporar nuevos productos al catálogo del banco de forma controlada

Prioridad:   Alta
Estimación:  M
Dependencias: HU-01 (SPEC-001)
Capa:        Frontend
```

#### Criterios de Aceptación — HU-04

**Happy Path**
```gherkin
CRITERIO-4.1: Navegar al formulario desde el botón Agregar
  Dado que:  el operador está en /products
  Cuando:    hace clic en el botón "Agregar"
  Entonces:  navega a /products/add
  Y:         se muestra el formulario vacío con todos los campos
  Y:         el título del formulario indica que es un nuevo registro
```

**Happy Path**
```gherkin
CRITERIO-4.2: Crear producto exitosamente
  Dado que:  el operador está en /products/add
  Y:         completa todos los campos con datos válidos:
            - ID: "trj-crd"
            - Nombre: "Tarjetas de Crédito"
            - Descripción: "Tarjeta de consumo bajo la modalidad de crédito"
            - Logo: "https://example.com/logo.png"
            - Fecha de Liberación: fecha de mañana
  Y:         la Fecha de Revisión se calcula automáticamente (mañana + 1 año)
  Cuando:    presiona el botón "Agregar"
  Entonces:  se envía POST /bp/products con los datos del formulario
  Y:         el backend responde con { message: "Product added successfully", data: {...} }
  Y:         se muestra un mensaje de éxito
  Y:         se redirige a /products
  Y:         el nuevo producto aparece en la tabla
```

**Happy Path**
```gherkin
CRITERIO-4.3: Botón Reiniciar limpia el formulario
  Dado que:  el operador ha llenado algunos campos del formulario
  Cuando:    presiona el botón "Reiniciar"
  Entonces:  todos los campos vuelven a su valor inicial (vacíos)
  Y:         los mensajes de error se limpian
  Y:         el formulario permanece en /products/add
```

**Error Path**
```gherkin
CRITERIO-4.4: Validación de ID duplicado
  Dado que:  el operador está en /products/add
  Y:         ingresa un ID que ya existe en el sistema
  Cuando:    el campo ID pierde el foco (blur)
  Entonces:  se ejecuta GET /bp/products/verification/:id
  Y:         el backend responde true
  Y:         se muestra error: "Este ID ya existe. Elija otro identificador."
  Y:         el botón Agregar permanece deshabilitado
```

**Error Path**
```gherkin
CRITERIO-4.5: Validación de campos requeridos
  Dado que:  el operador está en /products/add
  Cuando:    presiona "Agregar" sin llenar los campos obligatorios
  Entonces:  se muestran errores visuales en cada campo vacío:
            - ID: "Este campo es requerido"
            - Nombre: "Este campo es requerido"
            - Descripción: "Este campo es requerido"
            - Logo: "Este campo es requerido"
            - Fecha de Liberación: "Este campo es requerido"
  Y:         no se envía la petición POST al backend
```

**Error Path**
```gherkin
CRITERIO-4.6: Validación de longitud de ID
  Dado que:  el operador ingresa un ID de 2 caracteres
  Cuando:    el campo pierde el foco
  Entonces:  se muestra error: "El ID debe tener entre 3 y 10 caracteres"
  Dado que:  ingresa un ID de 11 caracteres
  Cuando:    el campo pierde el foco
  Entonces:  se muestra error: "El ID debe tener entre 3 y 10 caracteres"
```

**Error Path**
```gherkin
CRITERIO-4.7: Validación de longitud de Nombre
  Dado que:  el operador ingresa un nombre de 4 caracteres
  Entonces:  se muestra error: "El nombre debe tener entre 5 y 100 caracteres"
  Dado que:  ingresa un nombre de 101 caracteres
  Entonces:  se muestra error: "El nombre debe tener entre 5 y 100 caracteres"
```

**Error Path**
```gherkin
CRITERIO-4.8: Validación de longitud de Descripción
  Dado que:  el operador ingresa una descripción de 9 caracteres
  Entonces:  se muestra error: "La descripción debe tener entre 10 y 200 caracteres"
  Dado que:  ingresa una descripción de 201 caracteres
  Entonces:  se muestra error: "La descripción debe tener entre 10 y 200 caracteres"
```

**Error Path**
```gherkin
CRITERIO-4.9: Validación de fecha de liberación
  Dado que:  el operador selecciona una fecha anterior a hoy
  Cuando:    el campo pierde el foco
  Entonces:  se muestra error: "La fecha de liberación debe ser igual o posterior a hoy"
```

**Error Path**
```gherkin
CRITERIO-4.10: Error del backend al crear
  Dado que:  el operador completó el formulario correctamente
  Cuando:    presiona "Agregar" y el backend falla (error 400/500)
  Entonces:  se muestra un mensaje de error general debajo del formulario
  Y:         el formulario permanece visible con los datos ingresados
  Y:         el botón Agregar se rehabilita para reintentar
```

**Edge Case**
```gherkin
CRITERIO-4.11: Cálculo automático de date_revision
  Dado que:  el operador selecciona date_release = "2026-04-29"
  Cuando:    el campo date_release cambia
  Entonces:  date_revision se actualiza automáticamente a "2027-04-29"
  Y:         el campo date_revision está deshabilitado (no editable)
  Y:         si date_release está vacío, date_revision también se vacía
```

**Edge Case**
```gherkin
CRITERIO-4.12: Año bisiesto — 29 de febrero
  Dado que:  el operador selecciona date_release = "2028-02-29"
  Cuando:    se calcula date_revision
  Entonces:  date_revision = "2029-02-28" (1 año después, ajustando año no bisiesto)
```

### Reglas de Negocio

#### Validaciones del Formulario

| Campo | Tipo | Validadores Síncronos | Validador Asíncrono |
|-------|------|----------------------|---------------------|
| `id` | `string` | `required`, `minLength(3)`, `maxLength(10)` | `idExists()` — llama a `GET /bp/products/verification/:id` |
| `name` | `string` | `required`, `minLength(5)`, `maxLength(100)` | — |
| `description` | `string` | `required`, `minLength(10)`, `maxLength(200)` | — |
| `logo` | `string` | `required` | — |
| `date_release` | `string` | `required`, `dateNotPast()` | — |
| `date_revision` | `string` | `required` | — (campo deshabilitado, calculado automáticamente) |

#### Otras reglas
1. `id` debe ser único. Se valida contra la API al perder el foco (blur) y al submit.
2. `date_revision` se calcula automáticamente como `date_release + 1 año`. Campo deshabilitado.
3. En año bisiesto (29 feb), `date_revision` se ajusta a 28 feb del año siguiente.
4. El formulario usa Reactive Forms de Angular. No template-driven.
5. Errores se muestran debajo de cada campo en texto rojo.
6. El botón "Agregar" se deshabilita mientras el formulario es inválido o se está enviando.
7. Tras creación exitosa, redirigir a `/products`.

---

## 2. DISEÑO

### API — Endpoints consumidos

| Método | Ruta | Body / Params | Response | Cuándo |
|--------|------|---------------|----------|--------|
| `POST` | `/bp/products` | `Product` | `{ message, data }` | Al enviar formulario |
| `GET` | `/bp/products/verification/:id` | — | `true` / `false` | Validación asíncrona de ID |

### Arquitectura Frontend

#### Estructura de archivos

```
src/app/
├── features/
│   └── products/
│       ├── pages/
│       │   ├── product-list/
│       │   │   └── product-list.page.ts         ← [MODIFICAR] Botón "Agregar" (D3)
│       │   └── product-form/
│       │       ├── product-form.page.ts         ← [NUEVO] Smart page (OnPush)
│       │       ├── product-form.page.scss       ← [NUEVO] Estilos D2
│       │       └── product-form.page.html       ← [NUEVO] Template
│       └── components/
│           └── product-form/
│               ├── product-form.component.ts    ← [NUEVO] Dumb component (OnPush)
│               ├── product-form.component.scss  ← [NUEVO] Estilos D2
│               └── product-form.component.html  ← [NUEVO] Template
└── shared/
    ├── validators/
    │   ├── product-validators.ts                ← [NUEVO] PRODUCT_VALIDATORS + PRODUCT_ERROR_MESSAGES (DRY)
    │   ├── date-not-past.validator.ts           ← [NUEVO] Validador fecha ≥ hoy
    │   └── id-exists.validator.ts               ← [NUEVO] Validador asíncrono ID único
    └── utils/
        └── date.util.ts                         ← [NUEVO] DateUtil.addOneYear() con año bisiesto (DRY)
```

> Nota: `ErrorInterceptor` (core) y `ApiError` (model) ya existen de SPEC-001. Se reutilizan para tipar errores del POST.

#### Componentes

| Componente | Selector | Inputs | Outputs | Descripción |
|------------|----------|--------|---------|-------------|
| `ProductFormComponent` | `app-product-form` | `product: Product \| null` (null = creación, Product = edición) | `formSubmit: EventEmitter<Product>`, `formReset: EventEmitter<void>` | Dumb component con `OnPush`. Formulario reactivo con 6 campos. Usa `PRODUCT_VALIDATORS` (DRY). Usa `DateUtil.addOneYear()` (DRY). Maneja `takeUntil` para unsubscribe. |

#### Páginas

| Página | Ruta | Responsabilidad |
|--------|------|-----------------|
| `ProductFormPage` | `/products/add` | Smart page con `OnPush`. Compone `ProductFormComponent`. Al recibir `formSubmit`: llama a `ProductService.create()`, maneja `ApiError` tipado, redirige. Usa `takeUntil` para unsubscribe. |

#### Modificaciones a componentes existentes

| Archivo | Cambio |
|---------|--------|
| `product-list.page.ts` | Agregar botón "Agregar" con routerLink a `/products/add`. |
| `product-list.page.html` | Incluir `<button routerLink="/products/add">Agregar</button>` con estilos D3. |

#### Configuración del Formulario Reactivo (DRY con PRODUCT_VALIDATORS)

```typescript
// product-form.component.ts
import { PRODUCT_VALIDATORS, PRODUCT_ERROR_MESSAGES } from '../../shared/validators/product-validators';
import { DateUtil } from '../../shared/utils/date.util';

this.form = this.fb.group({
  id: ['', {
    validators: PRODUCT_VALIDATORS.id,  // DRY: validadores compartidos
    asyncValidators: this.isEditMode ? [] : [this.idExistsValidator.validate.bind(this.idExistsValidator)],
    updateOn: 'blur',
  }],
  name: ['', PRODUCT_VALIDATORS.name],
  description: ['', PRODUCT_VALIDATORS.description],
  logo: ['', PRODUCT_VALIDATORS.logo],
  date_release: ['', [Validators.required, dateNotPastValidator()]],
  date_revision: [{ value: '', disabled: true }, PRODUCT_VALIDATORS.date_revision],
});

// Calcular date_revision automáticamente (DRY: DateUtil)
this.form.get('date_release')?.valueChanges
  .pipe(takeUntil(this.destroy$))  // SOLID: unsubscribe limpio
  .subscribe((value) => {
    const revisionDate = DateUtil.addOneYear(value);  // DRY: helper compartido
    this.form.get('date_revision')?.setValue(revisionDate);
  });
```

#### Cálculo de date_revision + 1 año (DateUtil — DRY)

```typescript
// shared/utils/date.util.ts — usado en ProductFormComponent y DateDisplayPipe
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

  private static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
}
```
> Sin dependencia de `Date` nativo de JS (evita bugs con zonas horarias y años bisiestos).

#### Validador de Fecha No Pasada

```typescript
export function dateNotPastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(control.value + 'T00:00:00');
    return inputDate >= today ? null : { dateNotPast: true };
  };
}
```

#### Validador Asíncrono de ID Existente

```typescript
@Injectable({ providedIn: 'root' })
export class IdExistsValidator {
  constructor(private productService: ProductService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }
    return this.productService.verifyId(control.value).pipe(
      map((exists) => (exists ? { idExists: true } : null)),
      catchError(() => of(null)),
    );
  }
}
```

### Rutas (app.routes.ts)

```typescript
{
  path: 'products/add',
  loadComponent: () => import('./features/products/pages/product-form/product-form.page')
    .then(m => m.ProductFormPage),
},
```

### Mensajes de Error por Campo

| Campo | Condición | Mensaje |
|-------|-----------|---------|
| `id` | required | "Este campo es requerido" |
| `id` | minlength / maxlength | "El ID debe tener entre 3 y 10 caracteres" |
| `id` | idExists (async) | "Este ID ya existe. Elija otro identificador." |
| `name` | required | "Este campo es requerido" |
| `name` | minlength / maxlength | "El nombre debe tener entre 5 y 100 caracteres" |
| `description` | required | "Este campo es requerido" |
| `description` | minlength / maxlength | "La descripción debe tener entre 10 y 200 caracteres" |
| `logo` | required | "Este campo es requerido" |
| `date_release` | required | "Este campo es requerido" |
| `date_release` | dateNotPast | "La fecha de liberación debe ser igual o posterior a hoy" |
| `date_revision` | required | "Este campo es requerido" |

### Consideraciones de Estilo (D2, D3)

#### D2 — Formulario
- Layout vertical con etiquetas arriba de cada campo.
- Inputs con borde gris claro, altura ~40px.
- Mensajes de error en rojo debajo del campo.
- Botones "Reiniciar" (secundario, gris) y "Agregar" (primario, amarillo/naranja según diseño) en la parte inferior.
- Fondo blanco para el formulario, sombra sutil.

#### D3 — Botón Agregar
- Botón amarillo/naranja con texto "Agregar" en la página de listado.
- Posicionado en la parte superior derecha o como botón flotante.
- Navega a `/products/add`.

---

## 3. LISTA DE TAREAS

### Frontend — Implementación

#### Validadores
- [x] Crear `date-not-past.validator.ts` — ValidatorFn para fecha ≥ hoy
- [x] Crear `id-exists.validator.ts` — AsyncValidator que llama a `verifyId()`
- [x] Manejar año bisiesto en `addOneYear()` — si date_release es 29 feb, ajustar a 28 feb

#### Componente — ProductForm
- [x] Crear `product-form.component.ts` (standalone)
- [x] Implementar formulario reactivo con `FormBuilder`
- [x] Implementar `@Input() product: Product | null` (para SPEC-005; en creación es null)
- [x] Implementar `@Output() formSubmit = new EventEmitter<Product>()`
- [x] Implementar `@Output() formReset = new EventEmitter<void>()`
- [x] Configurar campo `id` con validación asíncrona (`updateOn: 'blur'`)
- [x] Configurar campo `name` con minLength(5), maxLength(100)
- [x] Configurar campo `description` con minLength(10), maxLength(200)
- [x] Configurar campo `logo` como required
- [x] Configurar campo `date_release` con `dateNotPastValidator`
- [x] Configurar campo `date_revision` como disabled, calculado automáticamente
- [x] Implementar cálculo automático `date_revision = date_release + 1 año` (via `DateUtil.addOneYear()`)
- [x] Mostrar mensajes de error por campo debajo de cada input (via `getErrorMessage()` + `PRODUCT_ERROR_MESSAGES`)
- [x] Deshabilitar botón submit mientras el formulario es inválido o está submitting
- [x] Emitir `formSubmit` con el valor del formulario (`getRawValue()` para incluir campos disabled)
- [x] Emitir `formReset` al hacer clic en Reiniciar
- [x] Crear estilos SCSS según Diseño D2

#### Página — ProductFormPage
- [x] Crear `product-form.page.ts` (standalone)
- [x] Inyectar `ProductService` y `Router`
- [x] Componer `ProductFormComponent`
- [x] Al recibir `formSubmit`, llamar a `ProductService.create()`
- [x] En success: mostrar mensaje, redirigir a `/products`
- [x] En error: mostrar mensaje de error general, mantener formulario
- [x] Manejar estado `submitting` para prevenir doble envío (via `submitting$` BehaviorSubject)
- [x] Crear estilos SCSS — layout de página centrado

#### Página — ProductListPage (modificaciones)
- [x] Agregar botón "Agregar" con `routerLink="/products/add"`
- [x] Aplicar estilos D3 al botón (color amarillo, tamaño, posición en header)
- [x] Asegurar que el botón no se rompa con responsive (white-space: nowrap)

#### Rutas
- [x] Registrar ruta `/products/add` en `app.routes.ts`

#### Core (si no existe)
- [x] Agregar `verifyId(id: string): Observable<boolean>` en `ProductService` (ya existía desde SPEC-001)
- [x] Agregar `create(product: Product): Observable<{ message, data }>` en `ProductService` (ya existía desde SPEC-001)

### Tests — Jest

#### Validadores
- [x] `dateNotPastValidator: should return null for today's date` — fecha hoy
- [x] `dateNotPastValidator: should return null for future date` — fecha mañana
- [x] `dateNotPastValidator: should return error for past date` — fecha ayer
- [x] `dateNotPastValidator: should return null for empty value` — adicional
- [x] `idExistsValidator: should return null when id does not exist` — API retorna false
- [x] `idExistsValidator: should return idExists error when id exists` — API retorna true
- [x] `idExistsValidator: should return null when id is less than 3 chars` — adicional
- [x] `addOneYear: should add exactly one year` — 2026-04-29 → 2027-04-29
- [x] `addOneYear: should handle leap year Feb 29` — 2028-02-29 → 2029-02-28
- [x] `addOneYear: should handle year transition` — adicional
- [x] `addOneYear: should handle normal Feb 28` — adicional
- [x] `addOneYear: should return empty for empty input` — adicional

#### ProductFormComponent
- [x] `should render all 6 form fields` — verificar inputs
- [x] `should show required errors on empty submit` — presionar submit sin datos
- [x] `should show error for id with 2 chars` — id de 2 chars
- [x] `should show error for name with 4 chars` — nombre de 4 chars
- [x] `should show error for description with 9 chars` — descripción de 9 chars
- [x] `should show dateNotPast error for past date` — fecha pasada
- [x] `should auto-calculate date_revision when date_release changes` — seleccionar fecha, verificar
- [x] `should clear date_revision when date_release is emptied` — adicional
- [x] `should disable date_revision field` — verificar disabled
- [x] `should emit formSubmit with valid data` — llenar válido, submit, verificar emit
- [x] `should emit formReset when reset button clicked` — verificar emit
- [x] `should clear form values on reset` — adicional
- [x] `should disable submit button when form is invalid`
- [x] `should show "Editar Producto" title in edit mode` — adicional (SPEC-005)
- [x] `should disable id field in edit mode` — adicional (SPEC-005)

#### ProductFormPage
- [x] `should create` — verificar creación del componente
- [x] `should call ProductService.create on formSubmit` — mock servicio, emitir, verificar llamada
- [x] `should show error message on create failure` — mock error 400, verificar mensaje
- [x] `should set submitting back to false on error` — verificar botón rehabilitado
- [x] `should clear error on form reset`
- [x] `should complete destroy$ on destroy` — adicional
