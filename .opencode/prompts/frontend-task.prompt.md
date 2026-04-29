---
name: frontend-task
description: Implementa una funcionalidad en el frontend Angular basada en una spec ASDD aprobada.
argument-hint: "<nombre-feature> (debe existir .opencode/specs/<nombre-feature>.spec.md)"
---

# Prompt: /frontend-task

## Prerequisitos
- Spec `.opencode/specs/<feature>.spec.md` con estado `APPROVED`.
- Stack: Angular 14, SCSS, Jest.

## Flujo

1. Lee la spec en `.opencode/specs/<feature>.spec.md` — si no existe, detente e informa.
2. Lee las instrucciones: `.opencode/instructions/frontend.instructions.md`.
3. Explora componentes y servicios existentes — no duplicar.
4. Implementa en orden: services → models → components → pages → ruta.
5. Verifica `ng build` sin errores.

## Orden de Implementación

| Capa | Responsabilidad |
|------|-----------------|
| Services | Llamadas HTTP al backend |
| Models | Interfaces TypeScript |
| Components | Dumb — @Input/@Output, OnPush |
| Pages | Smart — orquestan servicios, OnPush |
| Rutas | Registrar en `app.routes.ts` |

## Convenciones
- Standalone components con `OnPush`.
- SCSS puro, sin frameworks CSS.
- `takeUntil(destroy$)` en suscripciones (Angular 14).
- `PRODUCT_VALIDATORS` para validaciones compartidas.
- `DateUtil` + `DateDisplayPipe` para fechas.

## Restricciones
- Solo en `src/app/`.
- No generar tests (responsabilidad de test-engineer-frontend).
- No frameworks CSS.
