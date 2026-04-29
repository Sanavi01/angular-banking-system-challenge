# Specs — Flujo de Desarrollo

> **ASDD Pipeline:** `.opencode/requirements/` → `.opencode/specs/` → Implementación → Tests → QA

---

## Orden de Ejecución

```
SPEC-001 (F1 — Listado)
    │
    ├──► SPEC-002 (F2 — Búsqueda)        ← Paralelo con SPEC-003
    ├──► SPEC-003 (F3 — Paginación)       ← Paralelo con SPEC-002
    │
    └──► SPEC-004 (F4 — Agregar producto)
             │
             └──► SPEC-005 (F5 — Editar producto)  ← Deseable (SemiSenior)
```

---

## Dependencias por Spec

| Spec | Funcionalidad | Dependencias | Tipo | Diseño |
|------|--------------|--------------|------|--------|
| **SPEC-001** | F1 — Listado de productos | Ninguna | **Requerido** | D1 |
| **SPEC-002** | F2 — Búsqueda de productos | SPEC-001 | **Requerido** | D1 |
| **SPEC-003** | F3 — Paginación y cantidad de registros | SPEC-001 | **Requerido** | D1 |
| **SPEC-004** | F4 — Agregar producto | SPEC-001 | **Requerido** | D2, D3 |
| **SPEC-005** | F5 — Editar producto | SPEC-001, SPEC-004 | **Deseable** | D2, D3 |

---

## Estado Actual

| Spec | Estado | Fecha | Asignado |
|------|--------|-------|----------|
| SPEC-001 | `DRAFT` | 2026-04-29 | — |
| SPEC-002 | `DRAFT` | 2026-04-29 | — |
| SPEC-003 | `DRAFT` | 2026-04-29 | — |
| SPEC-004 | `DRAFT` | 2026-04-29 | — |
| SPEC-005 | `DRAFT` | 2026-04-29 | — |

---

## Ciclo de Vida de una Spec

```
DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED → DEPRECATED
```

1. **DRAFT** — Generada por Spec Generator, pendiente de revisión.
2. **APPROVED** — Revisada y aprobada por el desarrollador. Lista para implementar.
3. **IN_PROGRESS** — En implementación activa por Frontend Developer.
4. **IMPLEMENTED** — Código completo, tests pasando, cobertura ≥ 70%.
5. **DEPRECATED** — Obsoleta (solo si un feature se reemplaza).

---

## Reglas ASDD

1. **No implementar sin spec APPROVED.** Ninguna línea de código sin spec aprobada.
2. **Respetar dependencias.** No empezar SPEC-002 sin SPEC-001 en `IN_PROGRESS`.
3. **Una spec a la vez por desarrollador.** SPEC-002 y SPEC-003 pueden ir en paralelo.
4. **Cada spec tiene su propio checklist de tareas.** El Orchestrator monitorea progreso por spec.
5. **El estado se actualiza en el frontmatter YAML de cada archivo.**
