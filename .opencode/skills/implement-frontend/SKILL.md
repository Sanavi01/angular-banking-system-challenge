---
name: implement-frontend
description: Implementa un feature completo en el frontend Angular. Requiere spec con status APPROVED en .opencode/specs/.
argument-hint: "<nombre-feature>"
---

# Implement Frontend (Angular)

## Prerequisitos
1. Leer spec: `.opencode/specs/<feature>.spec.md`
2. Leer stack: `.opencode/instructions/frontend.instructions.md`
3. Leer diccionario de dominio: `.opencode/copilot-instructions.md`

## Orden de implementación
```
services → models → components → pages → registrar ruta
```

| Capa | Responsabilidad |
|------|-----------------|
| **Services** | Llamadas HTTP al backend via `HttpClient` — sin estado |
| **Models** | Interfaces y tipos TypeScript |
| **Components** | UI reutilizable — `@Input()`, `@Output()` |
| **Pages** | Composición final — layout + rutas + carga de datos |

## Patrones obligatorios
- **HTTP**: `HttpClient` de Angular, solo desde servicios inyectables.
- **Estilos**: SCSS puro por componente. NUNCA frameworks CSS (Bootstrap, Tailwind, Angular Material).
- **Rutas**: Angular Router con lazy loading (`loadComponent`).
- **Componentes**: Standalone (`standalone: true`).
- **Formularios**: Reactivos (`ReactiveFormsModule`) con validaciones.
- **Fechas**: API envía/recibe `YYYY-MM-DD`. UI muestra `DD/MM/YYYY`.
- **date_revision**: Calculado automáticamente = `date_release + 1 año`. Campo deshabilitado.

## Templates disponibles

Ver `.opencode/skills/implement-frontend/templates/`:
- `component.ts` — Componente standalone
- `page.ts` — Página standalone
- `service.ts` — Servicio HTTP
- `model.ts` — Interface/modelo

## Restricciones
- Solo directorio `src/app/`. No tocar backend (`repo-interview-main/`).
- No generar tests (responsabilidad de `test-engineer-frontend`).
- No usar frameworks CSS — solo SCSS puro.
