# Plan de Mejora de Tests

> Auditoría de recomendaciones — orden de implementación

---

## ✅ Punto 1 — Desacoplar tests del DOM

**Problema:** Tests usan `By.css('input, textarea')` y dependen de la estructura HTML. Si el HTML cambia, los tests se rompen sin que haya bug real.

**Solución:**
- Agregar `data-testid` a todos los elementos HTML relevantes
- Separar tests de lógica pura (FormGroup) de tests de renderizado (DOM)
- Reemplazar `By.css('input')` por `By.css('[data-testid="field-id"]')`

**Archivos afectados:** 7 HTMLs + 6 specs

**Estado:** ✅ Completado

---

## ✅ Punto 2 — Validaciones más precisas

**Problema:** `expect(control.invalid).toBe(true)` no dice por qué falla.

**Solución:** Reemplazar por `expect(control.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } })`.

**Archivos afectados:** `product-form.component.spec.ts`

**Estado:** ✅ Completado — 0 assertions imprecisas en todo el proyecto

---

## ✅ Punto 3 — Reducir `fixture.detectChanges()`

**Problema:** Se llama en tests de lógica donde no es necesario.

**Solución:** Tests de `FormGroup` sin `detectChanges()`, tests de DOM con `detectChanges()`.

**Cambios:** Eliminados 3 `detectChanges()` innecesarios en tests de `date_revision` (RxJS es sincrónico).

**Estado:** ✅ Completado

---

## ✅ Punto 4 — Verificar `disabled` en el DOM

**Problema:** Solo se verifica `form.invalid`, no `btn.nativeElement.disabled`.

**Solución:** Agregar `expect(submitBtn.nativeElement.disabled).toBe(true)`.

**Resultado:** Ya estaba implementado en todos los casos (submit, prev/next paginación, date_revision, id edit).

**Estado:** ✅ Completado

---

## ✅ Punto 5 — Separar tipos de test

**Problema:** Unitarios + integración + UI mezclados en un mismo archivo.

**Solución:**
- `product-form.logic.spec.ts` — validaciones puras con `FormBuilder`, sin TestBed, sin DOM (5 tests)
- `product-form.component.spec.ts` — integración Angular (eventos, submit, DOM)

**Resultado:** 16 suites, 160 tests, ejecución más rápida en tests puros.

**Estado:** ✅ Completado
