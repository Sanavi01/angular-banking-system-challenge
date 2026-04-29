---
name: generate-spec
description: Genera una especificación técnica ASDD para un nuevo feature Angular. Usa este comando con el nombre y descripción del feature.
argument-hint: "<nombre-feature>: <descripción del requerimiento>"
---

# Prompt: /generate-spec

## DoR (Definition of Ready) — Validar antes de generar

Una historia puede generar spec solo si cumple:
- Estructura **Como / Quiero / Para que** completa
- Términos canónicos del dominio (ver `.opencode/copilot-instructions.md` → Diccionario de Dominio)
- Criterios BDD: **Dado / Cuando / Entonces** (happy path + errores + edge cases)
- Alineada con stack Angular 14 + SCSS + Jest

Si no cumple → listar preguntas pendientes antes de generar.

## Flujo

1. Si el requerimiento no se proporcionó, busca en `.opencode/requirements/`. Si existe, úsalo.
2. Lee el stack: `.opencode/instructions/frontend.instructions.md`.
3. Usa la plantilla en `.opencode/skills/generate-spec/spec-template.md`.
4. Guarda en `.opencode/specs/<nombre-feature>.spec.md` con estado `DRAFT`.

## Restricciones
- Solo lectura + creación. No modificar código existente.
- Status siempre `DRAFT`. El usuario debe aprobar antes de implementar.
- Backend externo (repo-interview-main/), no se diseña aquí.
