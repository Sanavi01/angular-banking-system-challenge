---
name: unit-testing
description: Genera tests unitarios para el frontend Angular con Jest. Lee la spec y el código implementado. Requiere spec APPROVED e implementación completa.
argument-hint: "<nombre-feature>"
---

# Unit Testing (Angular + Jest)

## Definition of Done — verificar al completar

- [ ] Cobertura ≥ 70% (quality gate del proyecto)
- [ ] Tests aislados — sin conexión a API real (usar `HttpTestingController`)
- [ ] Escenario feliz + errores HTTP + validaciones de formulario cubiertos
- [ ] Los cambios no rompen funcionalidad existente

## Prerequisito — Lee en paralelo

```
.opencode/specs/<feature>.spec.md          (criterios de aceptación)
código implementado en src/app/
.opencode/instructions/frontend.instructions.md   (Angular + SCSS)
.opencode/instructions/tests.instructions.md      (Jest + Angular Testing)
```

## Output

```
src/app/
  core/services/*.spec.ts           ← pruebas de servicios HTTP
  features/<feature>/
    pages/**/*.spec.ts              ← pruebas de páginas
    components/**/*.spec.ts         ← pruebas de componentes
  shared/
    pipes/**/*.spec.ts              ← pruebas de pipes
```

| Archivo | Cubre |
|---------|-------|
| `*.service.spec.ts` | Respuestas exitosas, errores HTTP (400, 404, 500), transformación |
| `*.component.spec.ts` | Render correcto, @Input/@Output, interacciones, estados |
| `*.page.spec.ts` | Composición, navegación, integración con servicios |
| `*.pipe.spec.ts` | Transformación, edge cases |

## Patrones core (Jest + Angular)

```typescript
// Servicio — HttpTestingController
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

it('should handle 404 error', () => {
  service.getById('nope').subscribe({
    error: (err) => expect(err.status).toBe(404),
  });
  const req = httpMock.expectOne('http://localhost:3002/bp/products/nope');
  req.flush('Not found', { status: 404, statusText: 'Not Found' });
});
```

```typescript
// Componente — TestBed + fixture
it('should emit search term', () => {
  jest.spyOn(component.searchChange, 'emit');
  input.nativeElement.value = 'test';
  input.nativeElement.dispatchEvent(new Event('input'));
  fixture.detectChanges();
  expect(component.searchChange.emit).toHaveBeenCalledWith('test');
});
```

## Templates disponibles

Ver `.opencode/skills/unit-testing/templates/`:
- `component.spec.ts` — Plantilla de test para componente
- `service.spec.ts` — Plantilla de test para servicio
- `pipe.spec.ts` — Plantilla de test para pipe

## Restricciones

- Solo `*.spec.ts`. No modificar código fuente.
- Nunca llamar a API real — usar `HttpTestingController`.
- Cobertura mínima ≥ 70%.
