---
name: qa-task
description: Ejecuta el QA Agent con los skills secuenciales para generar el plan de calidad completo basado en la spec aprobada.
---

# Prompt: /qa-task

Ejecuta el QA Agent con los skills en secuencia.

**Feature**: `<nombre-feature>`

## Instrucciones para QA Agent

1. Lee `.opencode/docs/lineamientos/qa-guidelines.md` como primer paso.
2. Lee la spec en `.opencode/specs/<feature>.spec.md`.
3. Ejecuta en orden:
   - `/gherkin-case-generator` → casos Gherkin + datos de prueba
   - `/risk-identifier` → matriz de riesgos ASD
4. Output en `docs/output/qa/`.

**Prerequisito:** Debe existir `.opencode/specs/<feature>.spec.md` con estado APPROVED. Si no, ejecutar `/generate-spec` primero.
