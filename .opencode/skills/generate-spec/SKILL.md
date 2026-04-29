---
name: generate-spec
description: Genera una spec técnica ASDD en .opencode/specs/<feature>.spec.md. Obligatorio antes de cualquier implementación.
argument-hint: "<nombre-feature>: <descripción del requerimiento>"
---

# Generate Spec

## Definition of Ready — validar antes de generar

Una historia puede generar spec solo si cumple:

- [ ] Estructura **Como / Quiero / Para que** completa
- [ ] Términos canónicos del dominio (ver `.opencode/copilot-instructions.md` → Diccionario de Dominio)
- [ ] Criterios BDD: **Dado / Cuando / Entonces** (feliz + validaciones + errores)
- [ ] Contrato API explícito si aplica (método, ruta, request, response, códigos HTTP)
- [ ] Alineada con arquitectura y stack (Angular + SCSS + RxJS + Jest)
- [ ] Dependencias y riesgos identificados

Si el requerimiento no cumple el DoR → listar las preguntas pendientes antes de generar.

## Proceso

1. Busca requerimiento en `.opencode/requirements/<feature>.md` (si existe, úsalo)
2. Lee las instrucciones de stack: `.opencode/instructions/frontend.instructions.md`
3. Explora código existente — no duplicar componentes ni servicios existentes
4. Valida DoR (arriba) — si hay ambigüedades, lista preguntas antes de continuar
5. Usa plantilla: `.opencode/skills/generate-spec/spec-template.md` EXACTAMENTE
6. Guarda en `.opencode/specs/<nombre-en-kebab-case>.spec.md`

## Frontmatter obligatorio

```yaml
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
```

## Secciones obligatorias

- `## 1. REQUERIMIENTOS` — HU (Como/Quiero/Para) + criterios Gherkin + reglas de negocio + validaciones
- `## 2. DISEÑO` — diseño frontend: componentes, páginas, servicios, formularios, estilos (D1-D4)
- `## 3. LISTA DE TAREAS` — checklists frontend `[ ]`, tests `[ ]`, QA `[ ]`

## Restricciones

- Solo leer + crear. No modificar código existente.
- Status siempre `DRAFT`. El usuario aprueba antes de implementar.
- Backend es externo (Express en repo-interview-main/). No se diseña ni implementa aquí.
