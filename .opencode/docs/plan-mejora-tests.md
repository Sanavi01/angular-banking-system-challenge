# Plan de Mejora de Tests

> Auditoría de recomendaciones — orden de implementación

---

## ✅ Punto 1 — Desacoplar tests del DOM

**Problema:** Tests usan `By.css('input, textarea')` y dependen de la estructura HTML. Si el HTML cambia, los tests se rompen sin que haya bug real.

**Solución:**
- Agregar `data-testid` a todos los elementos HTML relevantes
- Separar tests de lógica pura (FormGroup) de tests de renderizado (DOM)
- Reemplazar `By.css('input')` por `By.css('[data-testid="field-id"]')`

**Archivos afectados:**
- `product-form.component.html` → agregar `data-testid`
- `product-form.component.spec.ts` → refactorizar selectores
- `product-table.component.html` → agregar `data-testid`
- `product-table.component.spec.ts` → refactorizar selectores
- `product-search.component.html` → agregar `data-testid`
- `product-search.component.spec.ts` → refactorizar selectores
- `product-pagination.component.html` → agregar `data-testid`
- `product-pagination.component.spec.ts` → refactorizar selectores
- `product-menu.component.html` → agregar `data-testid`
- `product-menu.component.spec.ts` → refactorizar selectores
- `product-list.page.html` → agregar `data-testid`
- `product-list.page.spec.ts` → refactorizar selectores
- `product-form.page.html` → agregar `data-testid`
- `product-form.page.spec.ts` → refactorizar selectores

**Estado:** ✅ Completado

---

## ✅ Punto 2 — Validaciones más precisas

**Problema:** `expect(control.invalid).toBe(true)` no dice por qué falla.

**Solución:**
- Reemplazar por `expect(control.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } })`

**Archivos afectados:**
- `product-form.component.spec.ts`

**Estado:** ✅ Completado

---

## ⬜ Punto 3 — Reducir `fixture.detectChanges()`

**Problema:** Se llama en tests de lógica donde no es necesario.

**Solución:**
- Tests de `FormGroup` → sin `detectChanges()`
- Tests de DOM/renderizado → con `detectChanges()`

**Estado:** ⬜ Pendiente (depende del Punto 1)

---

## ✅ Punto 4 — Verificar `disabled` en el DOM

**Problema:** Solo se verifica `form.invalid`, no `btn.nativeElement.disabled`.

**Solución:**
- Agregar `expect(submitBtn.nativeElement.disabled).toBe(true)` donde corresponda.

**Archivos afectados:**
- `product-form.component.spec.ts`

**Estado:** ✅ Completado (ya estaba implementado)

---

## ⬜ Punto 5 — Test de cleanup con `destroy$`

**Problema:** White-box testing frágil.

**Decisión:** Mantener por ahora (valor en Angular sin `DestroyRef`). Migrar cuando usemos `DestroyRef` o signals.

**Estado:** ⬜ Postergado

---

## ⬜ Punto 6 — Helper para edit mode

**Problema:** Setup duplicado en tests de edición.

**Solución:** Crear `createComponentInEditMode()` helper.

**Archivos afectados:**
- `product-form.component.spec.ts`

**Estado:** ⬜ Pendiente

---

## ⬜ Punto 7 — Separar tipos de test

**Problema:** Unitarios + integración + UI mezclados en un mismo archivo.

**Solución:**
- `product-form.logic.spec.ts` — validaciones puras (sin TestBed)
- `product-form.component.spec.ts` — integración Angular + DOM

**Estado:** ⬜ Postergado (post-entrega)
