# Requerimiento: Sistema de Productos Financieros

## Descripción General

Aplicación Angular para realizar operaciones CRUD sobre productos financieros ofrecidos por una entidad bancaria. La aplicación consume una API REST local (Express + Node.js) que expone los endpoints necesarios para listar, crear, actualizar, eliminar y verificar productos financieros.

## Alcance por Seniority — SemiSenior

| Funcionalidad | Requerida | Descripción |
|---------------|-----------|-------------|
| **F1** | Sí | Listado de productos financieros |
| **F2** | Sí | Búsqueda por texto |
| **F3** | Sí | Selector de cantidad de registros (5, 10, 20) |
| **F4** | Sí | Agregar nuevo producto |
| **F5** | Deseable | Editar producto existente |
| F6 | No | Eliminar producto (Senior) |

**Deseables adicionales (SemiSenior):**
- Uso de rutas (Angular Router)
- F5 (Editar producto)

---

## Problema / Necesidad

La entidad bancaria necesita un sistema para administrar su catálogo de productos financieros. Actualmente no existe una interfaz visual para consultar, crear y mantener estos productos. Se requiere una aplicación web que permita a los operadores del banco gestionar este catálogo de manera eficiente.

---

## Solución Propuesta

### F1. Listado de productos financieros

Visualizar todos los productos financieros desde la API en una tabla con columnas: Logo, Nombre, Descripción, Fecha de Liberación, Fecha de Revisión.

**Diseño:** D1 (Listado)

### F2. Búsqueda de productos

Campo de texto que filtra los productos por nombre o descripción en tiempo real (del lado del cliente).

**Diseño:** D1 (integrado en el listado)

### F3. Cantidad de registros

- Mostrar el total de resultados encontrados.
- Select desplegable con opciones: 5, 10, 20.
- Al cambiar la opción, se actualiza la cantidad de productos mostrados por página.
- Paginación del lado del cliente (nota: el backend no soporta paginación nativa; deuda técnica documentada).

**Diseño:** D1 (integrado en el listado)

### F4. Agregar producto

- Botón "Agregar" que navega al formulario de creación.
- Formulario con campos: ID, Nombre, Descripción, Logo (URL), Fecha de Liberación, Fecha de Revisión.
- Botones: "Agregar" (submit) y "Reiniciar" (reset).
- Validaciones con errores visuales por campo.

**Diseño:** Formulario (D2), Botón (D3)

### F5. Editar producto (deseable)

- Menú contextual (dropdown) en cada fila de la tabla.
- Opción "Editar" que navega al formulario precargado con los datos del producto.
- Campo ID deshabilitado en modo edición.
- Mismas validaciones que F4.

**Diseño:** Formulario (D2), Menú (D3)

---

## Validaciones del Formulario

| Campo | Regla |
|-------|-------|
| `id` | Requerido, 3-10 caracteres, único (validado contra API `GET /bp/products/verification/:id`) |
| `name` | Requerido, 5-100 caracteres |
| `description` | Requerido, 10-200 caracteres |
| `logo` | Requerido, debe ser una URL válida |
| `date_release` | Requerido, debe ser ≥ fecha actual |
| `date_revision` | Requerido, exactamente `date_release + 1 año`. Calculado automáticamente, campo deshabilitado |

---

## Contexto Técnico

- **Frontend:** Angular 14+, TypeScript 4.8+, SCSS (sin frameworks de estilos), Jest.
- **Backend:** Express + TypeScript (externo, en `repo-interview-main/`). Base URL: `http://localhost:3002/bp`.
- **Endpoints disponibles:**
  - `GET /bp/products` — Listar todos los productos
  - `POST /bp/products` — Crear producto
  - `PUT /bp/products/:id` — Actualizar producto
  - `DELETE /bp/products/:id` — Eliminar producto
  - `GET /bp/products/verification/:id` — Verificar si un ID existe (`true`/`false`)
- **Formato de fechas:** API recibe/envía `YYYY-MM-DD`. UI muestra `DD/MM/YYYY`.
- **Paginación:** El backend no soporta query params de paginación. Se implementa del lado del cliente como solución temporal (deuda técnica documentada).
- **date_revision:** El backend no calcula la regla de +1 año. Se implementa en el frontend: al seleccionar `date_release`, se calcula `date_revision = date_release + 1 año` automáticamente. Campo deshabilitado.

---

## Criterios de Aceptación (Alto Nivel)

1. La aplicación muestra una tabla con todos los productos financieros desde la API.
2. El campo de búsqueda filtra productos por nombre o descripción en tiempo real.
3. El selector de cantidad de registros (5, 10, 20) actualiza la paginación correctamente.
4. El total de resultados se actualiza al aplicar filtros.
5. El botón "Agregar" navega al formulario de creación.
6. El formulario valida todos los campos y muestra errores visuales.
7. Al enviar el formulario correctamente, se crea el producto y se redirige al listado.
8. El menú contextual permite editar un producto (navega al formulario con datos precargados).
9. El campo ID está deshabilitado en modo edición.
10. `date_revision` se calcula automáticamente al seleccionar `date_release`.

---

## Restricciones

- No usar frameworks de estilos (Bootstrap, Tailwind, Angular Material).
- Pruebas unitarias con Jest, cobertura mínima 70%.
- Seguir principios SOLID y Clean Code.
- El backend no se modifica — es un servicio externo.
- Paginación del lado del cliente (deuda técnica por limitación del backend).

## Prioridad

Alta — Prueba técnica de selección para perfil SemiSenior Angular.
