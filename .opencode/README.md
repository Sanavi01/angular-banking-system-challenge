# ASDD Framework — Guía de Uso (OpenCode)

**ASDD** (Agent Spec Software Development) es un framework de desarrollo asistido por IA que organiza el trabajo de software en fases orquestadas por agentes especializados.

```
Requerimiento → Spec → Frontend Angular → Tests Jest → QA → Doc (opcional)
```

> Esta guía cubre el uso con **OpenCode**.

---

## Requisitos

| Requisito | Detalle |
|---|---|
| OpenCode | CLI tool instalada |
| Angular 14+ | Framework frontend |
| Node.js 24+ | Runtime |
| Jest | Framework de testing |
| Backend local | Express en `repo-interview-main/` → `http://localhost:3002` |

---

## Onboarding — nuevo proyecto

Al copiar `.opencode/` a un proyecto nuevo, completa estos archivos **en orden** antes de usar cualquier agente:

| # | Archivo | Qué escribir |
|---|---------|-------------|
| 1 | `README.md` (raíz del proyecto) | Stack, arquitectura, comandos (`install`, `dev`, `test`, `build`) |
| 2 | `.opencode/instructions/frontend.instructions.md` | Framework Angular, estilos SCSS, HTTP client |
| 3 | `.opencode/copilot-instructions.md` (Diccionario de Dominio) | Términos canónicos del negocio |
| 4 | `.opencode/copilot-instructions.md` (DoR + DoD) | Criterios DoR y DoD del equipo |

**No modificar**: `agents/` (personalidad base), `skills/` (slash commands), `.opencode/docs/lineamientos/`, `AGENTS.md`

---

## El flujo ASDD paso a paso

### Paso 1 — Spec (obligatorio, siempre primero)

```
/generate-spec <nombre-feature>
```

El agente valida el requerimiento y genera `specs/<feature>.spec.md` con estado `DRAFT`.
Revisa y aprueba la spec (cambia a `APPROVED`) antes de continuar.

### Paso 2 — Implementación (Frontend)

```
/implement-frontend <nombre-feature>
```

Implementa componentes, servicios, páginas y rutas Angular según la spec.

### Paso 3 — Tests

```
/unit-testing <nombre-feature>
```

Genera pruebas unitarias con Jest. Mínimo 70% coverage.

### Paso 4 — QA

```
@QA Agent ejecuta QA para specs/<feature>.spec.md
```

Genera casos Gherkin y matriz de riesgos.

### Paso 5 — Documentación *(opcional)*

Al cerrar el feature.

---

### Flujo completo con Orchestrator

```
/asdd-orchestrate <nombre-feature>
```

---

## Agentes disponibles

| Agente | Fase | Cuándo usarlo |
|---|---|---|
| Orchestrator | Entry point | Coordinar el flujo completo (`/asdd-orchestrate status` para ver estado) |
| Spec Generator | Fase 1 | Validar un requerimiento y generar su spec técnica |
| Frontend Developer | Fase 2 | Implementar el frontend Angular según la spec |
| Test Engineer Frontend | Fase 3 | Generar tests unitarios con Jest |
| QA Agent | Fase 4 | Gherkin y riesgos |

---

## Skills disponibles

| Comando | Qué hace |
|---|---|
| `/asdd-orchestrate` | Orquesta el flujo completo o muestra estado actual |
| `/generate-spec` | Genera spec técnica con validación DoR |
| `/implement-frontend` | Implementa feature completo en el frontend Angular |
| `/unit-testing` | Genera suite de tests con Jest |
| `/gherkin-case-generator` | Flujos críticos + casos Given-When-Then + datos de prueba |
| `/risk-identifier` | Matriz de riesgos ASD (Alto/Medio/Bajo) |

---

## Estructura de carpetas

```
Project Root/
│
├── .opencode/                      ← framework ASDD
│   ├── README.md                   ← este archivo
│   ├── AGENTS.md                   ← reglas críticas para todos los agentes
│   ├── copilot-instructions.md     ← instrucciones + diccionario de dominio
│   │
│   ├── agents/                     ← 5 agentes
│   │   ├── orchestrator.agent.md
│   │   ├── spec-generator.agent.md
│   │   ├── frontend-developer.agent.md
│   │   ├── test-engineer-frontend.agent.md
│   │   └── qa.agent.md
│   │
│   ├── skills/                     ← 6 skills
│   │   ├── asdd-orchestrate/
│   │   ├── generate-spec/
│   │   ├── implement-frontend/
│   │   ├── unit-testing/
│   │   ├── gherkin-case-generator/
│   │   └── risk-identifier/
│   │
│   ├── docs/lineamientos/
│   │   ├── dev-guidelines.md
│   │   ├── qa-guidelines.md
│   │   └── guidelines.md
│   │
│   ├── prompts/
│   │   ├── frontend-task.prompt.md
│   │   ├── generate-spec.prompt.md
│   │   ├── generate-tests.prompt.md
│   │   └── qa-task.prompt.md
│   │
│   ├── instructions/
│   │   ├── frontend.instructions.md
│   │   └── tests.instructions.md
│   │
│   ├── requirements/
│   └── specs/
│
├── repo-interview-main/            ← backend local Node.js/Express
└── src/                            ← frontend Angular
```

---

## Reglas de Oro

1. **No código sin spec aprobada** — siempre debe existir `specs/<feature>.spec.md` con estado `APPROVED`.
2. **No código no autorizado** — los agentes no generan ni modifican código sin instrucción explícita.
3. **No suposiciones** — si el requerimiento es ambiguo, el agente pregunta antes de actuar.
4. **Transparencia** — el agente explica qué va a hacer antes de hacerlo.
