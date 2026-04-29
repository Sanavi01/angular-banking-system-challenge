# Prueba Técnica – Frontend Angular (2024)

---

## 1. Indicaciones Generales

- Aplique todas las buenas prácticas, clean code, SOLID (se tomará en cuenta este punto para la calificación).
- Se debe realizar el UI Development (Maquetación) sin usar frameworks de estilos o componentes prefabricados.
- Se debe manejar excepciones y mostrar mensajes de errores visuales.
- Se debe realizar pruebas unitarias y contar con un mínimo de 70% coverage.
- Posterior a la entrega de este ejercicio, se estará agendando una entrevista técnica donde el candidato deberá defender la solución planteada.

> **Nota:** Los servicios necesarios a consumir para este proyecto son locales. Más adelante se detallará la manera de hacerlo.

---

## 2. Herramientas y Tecnologías

| Tecnología | Versión mínima |
|-----------|----------------|
| Angular | 14 |
| TypeScript | 4.8 |
| Pruebas unitarias | Jest (preferencia) |

- IDE de su preferencia.

---

## 3. Complejidad por Seniority

> Considerar las siguientes indicaciones según el perfil al que aplica.

### 3.1 Junior
| Requerido | Opcional |
|-----------|----------|
| F1, F2, F3 | F4, F5, F6 |

### 3.2 SemiSenior
| Requerido | Deseable |
|-----------|----------|
| F1, F2, F3, F4 | F5 y uso de rutas |

### 3.3 Senior
| Requerido | Deseable |
|-----------|----------|
| F1, F2, F3, F4, F5, F6 | Rendimiento, Pantallas de precarga (Skeletons), Responsive design |

---

## 4. Funcionalidades del Frontend

### F1. Listado de productos financieros
Aplicación para visualizar productos financieros desde una API.  
Maquetación basada en **Diseño D1**.

### F2. Búsqueda de productos financieros
Búsqueda mediante campo de texto.  
Maquetación basada en **Diseño D1**.

### F3. Cantidad de registros
- Mostrar cantidad de resultados.
- Select con opciones: `5`, `10`, `20`.

Maquetación basada en **Diseño D1**.

### F4. Agregar producto
- Botón **Agregar** → navega a formulario.
- Botones del formulario:
  - **Agregar**
  - **Reiniciar**

**Maquetación:**
- Formulario → **Diseño D2**
- Botón → **Diseño D3**

#### Validaciones del formulario

| Campo | Validación |
|-------|------------|
| `id` | Requerido, 3–10 caracteres, único (validar con API) |
| `name` | Requerido, 5–100 caracteres |
| `description` | Requerido, 10–200 caracteres |
| `logo` | Requerido |
| `date_release` | Requerido, ≥ fecha actual |
| `date_revision` | Requerido, exactamente +1 año |

- Mostrar errores visuales por campo.

### F5. Editar producto
- Menú dropdown por producto.
- Opción editar → navegación a formulario.
- ID deshabilitado.
- Validaciones iguales a F4.

**Maquetación:**
- Formulario → **Diseño D2**
- Menú → **Diseño D3**

### F6. Eliminar producto
- Opción eliminar en menú.
- Mostrar modal con botones:
  - **Cancelar**
  - **Eliminar**

**Maquetación:**
- Menú → **Diseño D3**
- Modal → **Diseño D4**

---

## 5. Diseños

| Código | Descripción |
|--------|-------------|
| **D1** | Listado |
| **D2** | Formulario |
| **D3** | Menú / botón |
| **D4** | Modal |

---

## 6. Documentación

### 6.1 Estructura de Producto Financiero

| Clave | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `id` | `String` | `trj-crd` | Identificador único |
| `name` | `String` | Tarjetas de Crédito | Nombre |
| `description` | `String` | Tarjeta de consumo bajo la modalidad de crédito | Descripción |
| `logo` | `String` | URL | Imagen del producto |
| `date_release` | `Date` | `2023-02-01` | Fecha de liberación |
| `date_revision` | `Date` | `2024-02-01` | Fecha de revisión |

---

## 7. Servicios (Backend Local)

Backend local en Node.js.

### 7.1 Instalación y ejecución

1. Descomprimir `repo-interview-main.zip`.
2. Abrir un terminal en la carpeta descomprimida.
3. Instalar dependencias:

```bash
npm install
```

4. Ejecutar el proyecto:

```bash
npm run start:dev
```

5. El servicio estará disponible en:

```
http://localhost:3002
```

> **Nota:** Si no tienes el archivo `repo-interview-main.zip`, debes solicitarlo al entrevistador.

### 7.2 API Endpoints

**Base URL:** `http://localhost:3002`

#### Obtener productos
```
GET /bp/products
```

**Ejemplo:**
```
http://localhost:3002/bp/products
```

**Respuesta:**
```json
{
  "data": [
    {
      "id": "uno",
      "name": "Nombre producto",
      "description": "Descripción producto",
      "logo": "assets-1.png",
      "date_release": "2025-01-01",
      "date_revision": "2025-01-01"
    }
  ]
}
```

#### Crear producto
```
POST /bp/products
```

**Body:**
```json
{
  "id": "dos",
  "name": "Nombre producto",
  "description": "Descripción producto",
  "logo": "assets-1.png",
  "date_release": "2025-01-01",
  "date_revision": "2025-01-01"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Product added successfully",
  "data": {
    "id": "dos",
    "name": "Nombre producto",
    "description": "Descripción producto",
    "logo": "assets-1.png",
    "date_release": "2025-01-01",
    "date_revision": "2025-01-01"
  }
}
```

#### Actualizar producto
```
PUT /bp/products/:id
```

**Ejemplo:**
```
http://localhost:3002/bp/products/uno
```

**Body:**
```json
{
  "name": "Nombre actualizado",
  "description": "Descripción producto",
  "logo": "assets-1.png",
  "date_release": "2025-01-01",
  "date_revision": "2025-01-01"
}
```

#### Eliminar producto
```
DELETE /bp/products/:id
```

**Ejemplo:**
```
http://localhost:3002/bp/products/dos
```

#### Verificación de existencia de ID
```
GET /bp/products/verification/:id
```

**Ejemplo:**
```
http://localhost:3002/bp/products/verification/uno
```

**Respuesta:**
```
true / false
```

---

## 8. Entregables

- La solución debe estar en un repositorio Git público.
- Enviar la URL del repositorio.
- Entregar antes de la fecha indicada.
