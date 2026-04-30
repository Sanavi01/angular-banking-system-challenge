---
name: generate-tests
description: Genera pruebas unitarias para el frontend Angular con Jest, basadas en la spec ASDD y el código implementado.
argument-hint: "<nombre-feature>"
---

# Prompt: /generate-tests

## Prerequisitos
- Spec `.opencode/specs/<feature>.spec.md` con estado `APPROVED` o `IN_PROGRESS`.
- Código implementado en `src/app/`.

## Flujo

1. Lee la spec en `.opencode/specs/<feature>.spec.md` — sección "LISTA DE TAREAS" > Tests.
2. Lee el código implementado en `src/app/`.
3. Lee las instrucciones: `.opencode/instructions/tests.instructions.md`.
4. Genera tests en archivos `*.spec.ts` junto al código fuente.
5. Ejecuta `ng test` para verificar que pasan.

## Suite de Tests a Generar

| Capa | Archivo | Escenarios |
|------|---------|------------|
| Services | `*.service.spec.ts` | Respuesta exitosa, errores HTTP (400, 404, 500) |
| Components | `*.component.spec.ts` | Render correcto, @Input/@Output, interacciones, estados |
| Pages | `*.page.spec.ts` | Composición, navegación, integración con servicios |
| Pipes/Utils | `*.spec.ts` | Transformación, edge cases |

## Restricciones
- Solo `*.spec.ts`. No modificar código fuente.
- Mockear `HttpClient` con `HttpTestingController`.
- No llamadas HTTP reales.
- Cobertura ≥ 70%.
