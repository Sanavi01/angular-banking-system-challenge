# AGENTS.md — ASDD Project

> Canonical shared version: this file is the source of truth for shared agent guidelines.

This file defines general guidance for all AI agents working in this repository, following the **ASDD (Agent Spec Software Development)** workflow.

## Project Summary

- **Project:** Sistema bancario — CRUD de productos financieros
- **Frontend:** Angular 14+, TypeScript 4.8+, SCSS sin frameworks de estilos
- **Backend:** Express + TypeScript, API REST local en `http://localhost:3002/bp`
- **Testing:** Jest con mínimo 70% coverage
- **Seniority target:** SemiSenior (F1, F2, F3, F4 requeridas + F5 deseable)

> Ver `README.md` en la raíz del proyecto para stack completo, comandos y estructura.
> Ver `.opencode/README.md` para la estructura completa del framework ASDD.

## ASDD Workflow

**Every new feature must follow this pipeline:**

```
[FASE 1 — Secuencial]
spec-generator    → /generate-spec      → .opencode/specs/<feature>.spec.md

[FASE 2 — Frontend]
frontend-developer→ páginas / componentes / services

[FASE 3 — Tests]
test-engineer-frontend → src/__tests__/

[FASE 4 — QA]
qa-agent          → /gherkin-case-generator, /risk-identifier

[FASE 5 — Opcional]
documentation     → README, API docs
```

## Agent Skills (slash commands)

Skills are portable instruction sets invokable as `/command` in OpenCode Chat.

### ASDD Core
| Skill | Slash Command | Descripción |
|-------|---------------|-------------|
| asdd-orchestrate | `/asdd-orchestrate` | Orquesta el flujo completo ASDD o consulta estado |
| generate-spec | `/generate-spec` | Genera spec técnica en `.opencode/specs/` |
| implement-frontend | `/implement-frontend` | Implementa feature completo en el frontend Angular |
| unit-testing | `/unit-testing` | Genera suite de tests con Jest |

### QA
| Skill | Slash Command | Descripción |
|-------|---------------|-------------|
| gherkin-case-generator | `/gherkin-case-generator` | Genera casos Given-When-Then + datos de prueba |
| risk-identifier | `/risk-identifier` | Clasifica riesgos con Regla ASD (Alto/Medio/Bajo) |

## Lineamientos y Contexto

Los agentes deben cargar estos archivos como **primer paso** antes de generar cualquier código:

| Documento | Ruta | Agentes que lo cargan |
|---|---|---|
| Lineamientos de Desarrollo | `.opencode/docs/lineamientos/dev-guidelines.md` | Frontend Developer |
| Lineamientos QA | `.opencode/docs/lineamientos/qa-guidelines.md` | Test Engineer Frontend, QA Agent |
| Reglas de Oro | `.opencode/AGENTS.md` | Todos (siempre activas) |
| Definition of Done | `.opencode/copilot-instructions.md` | Test Engineer Frontend, QA Agent, Orchestrator |
| Definition of Ready | `.opencode/copilot-instructions.md` | Spec Generator, Orchestrator |
| Stack y restricciones | `.opencode/instructions/frontend.instructions.md` | Frontend Developer, Spec Generator |

---

## Reglas de Oro

> Principio rector: todas las contribuciones de la IA deben ser seguras, transparentes, con propósito definido y alineadas con las instrucciones explícitas del usuario.

### I. Integridad del Código y del Sistema
- **No código no autorizado**: no escribir, generar ni sugerir código nuevo a menos que el usuario lo solicite explícitamente.
- **No modificaciones no autorizadas**: no modificar, refactorizar ni eliminar código, archivos o estructuras existentes sin aprobación explícita del usuario.
- **Preservar la lógica existente**: respetar patrones arquitectónicos, estilo de codificación y lógica operativa del proyecto.

### II. Clarificación de Requisitos
- **Clarificación obligatoria**: si la solicitud es ambigua, incompleta o poco clara, detenerse y solicitar clarificación antes de proceder.
- **No realizar suposiciones**: basar todas las acciones estrictamente en información explícita proporcionada por el usuario.

### III. Transparencia Operativa
- **Explicar antes de actuar**: antes de cualquier acción, explicar qué se va a hacer y posibles implicaciones.
- **Detención ante la incertidumbre**: si surge inseguridad o un conflicto con estas reglas, detenerse y consultar al usuario.
- **Acciones orientadas a un propósito**: cada acción debe ser directamente relevante para la solicitud explícita.

---

## Entradas al Pipeline ASDD

| Tipo | Directorio | Descripción |
|------|-----------|-------------|
| Requerimientos de negocio | `.opencode/requirements/` | Input: descripción funcional del feature |
| Especificaciones técnicas | `.opencode/specs/` | Output del Spec Generator, fuente de verdad para implementación |

## Critical Rules for All Agents

1. **No implementation without a spec.** Always check `.opencode/specs/` first.
2. **Single Responsibility (SRP)** — cada archivo una sola razón para cambiar. Servicios HTTP no manejan estado. Páginas no contienen lógica de render. Componentes no llaman APIs.
3. **Open/Closed** — componentes dumb extendibles por `@Input()` sin modificar código interno.
4. **Dependency Inversion (DIP)** — páginas dependen de abstracciones (servicios inyectables). Componentes dumb dependen de `@Input()`, no de servicios concretos.
5. **DRY** — validaciones compartidas en `PRODUCT_VALIDATORS`. Mensajes de error en `PRODUCT_ERROR_MESSAGES`. Lógica de fechas en `DateUtil`. Pipe de presentación `DateDisplayPipe`. Sin duplicación.
6. **State centralization** — `ProductStateService` como facade RxJS. Sin estado duplicado entre componentes. Páginas exponen observables al template via `async` pipe.
7. **Smart/Dumb pattern** — Páginas (smart) inyectan servicios y orquestan. Componentes (dumb) solo `@Input()` / `@Output()`.
8. **OnPush change detection** — `ChangeDetectionStrategy.OnPush` en todos los componentes.
9. **Unsubscribe** — `takeUntil(destroy$)` + `OnDestroy` en toda suscripción (Angular 14).
10. **HTTP calls through services** — nunca llamar `HttpClient` desde componentes o páginas.
11. **Error interceptor** — `ErrorInterceptor` global tipa y transforma errores HTTP. Tipos `ApiError` en todo el código.
12. **SCSS-only** — sin frameworks CSS (Bootstrap, Tailwind, Angular Material).
13. **Never commit secrets** — `.env`, credential files y API keys en `.gitignore`.
14. **Test coverage ≥ 70%** — toda feature incluye tests con Jest.

## Development Commands & Integration Notes

> Ver `README.md` en la raíz del proyecto.
