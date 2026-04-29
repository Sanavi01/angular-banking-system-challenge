# OpenCode Instructions

## ASDD Workflow (Agent Spec Software Development)

Este repositorio sigue el flujo **ASDD**: toda funcionalidad nueva se ejecuta en fases orquestadas por agentes especializados.

```
[Orchestrator] → [Spec Generator] → [Frontend] → [Tests FE] → [QA] → [Doc]
```

### Fases del flujo ASDD
1. **Spec**: El agente `spec-generator` genera la spec en `.opencode/specs/<feature>.spec.md`.
2. **Implementación**: `frontend-developer` implementa componentes, servicios y rutas Angular.
3. **Tests**: `test-engineer-frontend` genera y ejecuta pruebas unitarias con Jest.
4. **QA**: `qa-agent` genera estrategia, Gherkin, riesgos.
5. **Doc (opcional)**: `documentation-agent` genera README updates, API docs.

### Skills disponibles (slash commands):
- `/asdd-orchestrate` — orquesta el flujo completo ASDD o consulta estado
- `/generate-spec` — genera spec técnica en `.opencode/specs/`
- `/implement-frontend` — implementa feature completo en el frontend Angular
- `/unit-testing` — genera suite de tests con Jest
- `/gherkin-case-generator` — casos Given-When-Then + datos de prueba
- `/risk-identifier` — clasificación de riesgos ASD (Alto/Medio/Bajo)

### Requerimientos y Specs
- Los requerimientos de negocio viven en `.opencode/requirements/`. Son la entrada al pipeline ASDD.
- Las specs técnicas viven en `.opencode/specs/`. Cada spec es la fuente de verdad para implementar.
- Antes de implementar cualquier desarrollo, debe existir una spec aprobada en `.opencode/specs/`.
- Flujo: `requirements/<feature>.md` → `/generate-spec` → `specs/<feature>.spec.md` (APPROVED)

---

## Mapa de Archivos ASDD

### Agentes
| Agente | Fase | Ruta |
|---|---|---|
| Orchestrator | Entry point | `.opencode/agents/orchestrator.agent.md` |
| Spec Generator | Fase 1 | `.opencode/agents/spec-generator.agent.md` |
| Frontend Developer | Fase 2 | `.opencode/agents/frontend-developer.agent.md` |
| Test Engineer Frontend | Fase 3 | `.opencode/agents/test-engineer-frontend.agent.md` |
| QA Agent | Fase 4 | `.opencode/agents/qa.agent.md` |

### Skills
| Skill | Agente | Ruta |
|---|---|---|
| `/asdd-orchestrate` | Orchestrator | `.opencode/skills/asdd-orchestrate/SKILL.md` |
| `/generate-spec` | Spec Generator | `.opencode/skills/generate-spec/SKILL.md` |
| `/implement-frontend` | Frontend Developer | `.opencode/skills/implement-frontend/SKILL.md` |
| `/unit-testing` | Test Engineer Frontend | `.opencode/skills/unit-testing/SKILL.md` |
| `/gherkin-case-generator` | QA Agent | `.opencode/skills/gherkin-case-generator/SKILL.md` |
| `/risk-identifier` | QA Agent | `.opencode/skills/risk-identifier/SKILL.md` |

### Instructions (path-scoped)
| Scope | Ruta | Se aplica a |
|---|---|---|
| Frontend | `.opencode/instructions/frontend.instructions.md` | `src/app/**/*.ts` |
| Tests | `.opencode/instructions/tests.instructions.md` | `src/**/*.spec.ts` |

### Lineamientos y Contexto
| Documento | Ruta |
|---|---|
| Lineamientos de Desarrollo | `.opencode/docs/lineamientos/dev-guidelines.md` |
| Lineamientos QA | `.opencode/docs/lineamientos/qa-guidelines.md` |
| Stack + Arquitectura + Naming | `.opencode/instructions/frontend.instructions.md` |

### Lineamientos generales para todos los agentes
- **Reglas de Oro**: ver `.opencode/AGENTS.md` — rigen TODAS las interacciones.
- **Specs activas**: `.opencode/specs/` — consultar siempre antes de implementar.

---

## Reglas de Oro

> Principio rector: todas las contribuciones de la IA deben ser seguras, transparentes, con propósito definido y alineadas con las instrucciones explícitas del usuario.

### I. Integridad del Código y del Sistema
- **No código no autorizado**: no escribir, generar ni sugerir código nuevo a menos que el usuario lo solicite explícitamente.
- **No modificaciones no autorizadas**: no modificar, refactorizar ni eliminar código, archivos o estructuras existentes sin aprobación explícita.
- **Preservar la lógica existente**: respetar los patrones arquitectónicos, el estilo de codificación y la lógica operativa existentes del proyecto.

### II. Clarificación de Requisitos
- **Clarificación obligatoria**: si la solicitud es ambigua, incompleta o poco clara, detenerse y solicitar clarificación antes de proceder.
- **No realizar suposiciones**: basar todas las acciones estrictamente en información explícita provista por el usuario.

### III. Transparencia Operativa
- **Explicar antes de actuar**: antes de cualquier acción, explicar qué se hará y posibles implicaciones.
- **Detención ante la incertidumbre**: si surge inseguridad o conflicto con estas reglas, detenerse y consultar al usuario.
- **Acciones orientadas a un propósito**: cada acción debe ser directamente relevante para la solicitud explícita.

---

## Diccionario de Dominio

Términos canónicos a usar en specs, código y mensajes:

| Término | Definición | Sinónimos rechazados |
|---------|-----------|---------------------|
| **Producto Financiero** (`product`) | Entidad principal del sistema, representa un producto bancario | Producto, item |
| **ID** (`id`) | Identificador único del producto, 3-10 caracteres alfanuméricos | Código, identificador |
| **Nombre** (`name`) | Nombre del producto financiero, 5-100 caracteres | Título, nombre_producto |
| **Descripción** (`description`) | Descripción del producto financiero, 10-200 caracteres | Detalle, resumen |
| **Logo** (`logo`) | URL de la imagen representativa del producto | Imagen, icono, thumbnail |
| **Fecha de Liberación** (`date_release`) | Fecha en que el producto sale al mercado, ≥ fecha actual | Fecha lanzamiento, release_date |
| **Fecha de Revisión** (`date_revision`) | Exactamente 1 año posterior a `date_release` | Fecha revisión, revision_date |
| **Listado** | Pantalla principal con tabla de productos financieros (Diseño D1) | Tabla, grid, lista |
| **Formulario** | Pantalla de creación/edición de productos (Diseño D2) | Form, crear, editar |
| **Menú contextual** | Dropdown de acciones por producto: editar y eliminar (Diseño D3) | Context menu, acciones |
| **Modal de eliminación** | Diálogo de confirmación para eliminar un producto (Diseño D4) | Popup, confirmación |

**Reglas:**
- Campos de fecha se envían/reciben en formato ISO `YYYY-MM-DD`.
- En la UI las fechas se muestran como `DD/MM/YYYY`.
- `date_revision` siempre se calcula automáticamente como `date_release + 1 año`.
- La API base URL es `http://localhost:3002/bp/products`.

---

## Project Overview

> Ver `README.md` en la raíz del proyecto.
