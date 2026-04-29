---
id: SPEC-###
status: DRAFT
feature: nombre-del-feature
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: spec-generator
version: "1.0"
related-specs: []
---

# Spec: [Nombre de la Funcionalidad]

> **Estado:** `DRAFT` → aprobar con `status: APPROVED` antes de iniciar implementación.
> **Ciclo de vida:** DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED

---

## 1. REQUERIMIENTOS

### Descripción
Resumen de la funcionalidad en 2-3 oraciones.

### Requerimiento de Negocio
Requerimiento original (o referencia a `.opencode/requirements/<feature>.md`).

### Historias de Usuario

#### HU-01: [Título descriptivo]

```
Como:        [rol]
Quiero:      [acción]
Para:        [valor]

Prioridad:   Alta / Media / Baja
Estimación:  S / M / L
Dependencias: Ninguna / HU-X
Capa:        Frontend
```

#### Criterios de Aceptación — HU-01

**Happy Path**
```gherkin
CRITERIO-1.1: [nombre]
  Dado que:  [contexto válido]
  Cuando:    [acción del usuario]
  Entonces:  [resultado esperado]
```

**Error Path**
```gherkin
CRITERIO-1.2: [nombre]
  Dado que:  [contexto inicial]
  Cuando:    [acción inválida]
  Entonces:  [manejo del error]
```

**Edge Case** *(si aplica)*
```gherkin
CRITERIO-1.3: [nombre]
  Dado que:  [contexto de borde]
  Cuando:    [acción límite]
  Entonces:  [resultado esperado]
```

### Reglas de Negocio
1. [Regla de validación]
2. [Regla de integridad]

---

## 2. DISEÑO

### API Endpoints (Backend externo — `http://localhost:3002/bp`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/bp/products` | Listar productos |
| `POST` | `/bp/products` | Crear producto |
| `PUT` | `/bp/products/:id` | Actualizar producto |
| `DELETE` | `/bp/products/:id` | Eliminar producto |
| `GET` | `/bp/products/verification/:id` | Verificar ID existente |

### Diseño Frontend

#### Componentes
| Componente | Archivo | Props / Inputs | Descripción |
|------------|---------|----------------|-------------|

#### Páginas
| Página | Archivo | Ruta | Diseño |
|--------|---------|------|--------|

#### Servicios
| Servicio | Archivo | Métodos |
|----------|---------|---------|

#### Validaciones de Formulario
| Campo | Tipo | Validación |
|-------|------|-----------|

### Arquitectura y Dependencias
- **Nuevos paquetes:** [ninguno / listar]
- **Archivos afectados:** [punto de entrada, rutas, etc.]
- **Estilos:** Basado en Diseño D1 / D2 / D3 / D4

### Notas de Implementación
> Observaciones técnicas, decisiones de diseño o advertencias.

---

## 3. LISTA DE TAREAS

> Marcar cada ítem (`[x]`) al completarlo.

### Frontend

#### Implementación
- [ ] Crear modelo / interfaz
- [ ] Crear servicio HTTP
- [ ] Implementar componente [nombre]
- [ ] Implementar página [nombre]
- [ ] Registrar ruta
- [ ] Aplicar estilos SCSS según diseño

#### Validaciones
- [ ] Implementar validación de campo [nombre]
- [ ] Mostrar errores visuales por campo

### Tests

- [ ] Test de servicio: respuesta exitosa
- [ ] Test de servicio: manejo de errores HTTP
- [ ] Test de componente: render correcto
- [ ] Test de componente: interacciones y eventos
- [ ] Test de página: composición y navegación

### QA
- [ ] Ejecutar skill `/gherkin-case-generator`
- [ ] Ejecutar skill `/risk-identifier`
- [ ] Validar cobertura de tests ≥ 70%
- [ ] Actualizar estado spec: `status: IMPLEMENTED`
