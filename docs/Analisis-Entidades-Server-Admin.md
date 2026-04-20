# Análisis de Entidades — Transmetro-server-admin
## Arquitectura General
La aplicación es un servidor **Node.js + Express** que expone una API REST bajo la base URL `/TRANSMETRO-CONECTA/v1`. Usa **MongoDB** como base de datos (via Mongoose) y requiere autenticación JWT con rol `Admin` en todos los endpoints.
**Archivos clave de configuración:**
- `server-admin/index.js` — Punto de entrada, carga `.env`
- `server-admin/configs/app.js` — Inicialización de Express, middlewares y registro de rutas
- `server-admin/configs/db.js` — Conexión a MongoDB via `process.env.URI_MONGODB`
---
## Entidades Principales
### 1. 🚉 Station (Estación)
**Archivo modelo:** `server-admin/src/stations/station.model.js`
| Campo | Tipo | Restricciones |
|---|---|---|
| `name` | String | Requerido, único, max 100 chars |
| `stationCode` | String | Requerido, único, uppercase (ej. `EST-01`) |
| `typeStation` | String (enum) | `CENTRALES`, `CARRIL LATERAL`, `TRASBORDO`, `TERMINALES` |
| `status` | String (enum) | `ACTIVE`, `INACTIVE`, `MAINTENANCE`, `CLOSED` |
| `location` | GeoJSON Point | Requerido, coordenadas `[longitud, latitud]` |
| `isActive` | Boolean | Default: `true` |
| `createdAt`, `updatedAt` | Date | Auto (timestamps) |
- **Índice geoespacial:** `stationSchema.index({ location: '2dsphere' })`
- **Representa:** Una parada física del sistema de transporte
**Controlador:** `server-admin/src/stations/station.controller.js`
- `getAllStations` — Lista todas sin paginación (con filtros `status`, `typeStation`)
- `getStations` — Lista con paginación (page/limit)
- `getStationById` — Busca por MongoDB ObjectId **o** por `stationCode`
- `createStation` — Crea nueva estación con coordenadas GeoJSON
- `updateStation` — Actualiza campos (incluyendo reconstrucción del GeoJSON `location`)
- `changeStationStatus` — Cambia solo el campo `status`
**Rutas API:** `server-admin/src/stations/station.routes.js` → `/TRANSMETRO-CONECTA/v1/stations`
| Método | Ruta | Acción |
|---|---|---|
| GET | `/` | Lista con paginación y filtros |
| GET | `/all` | Lista completa sin paginación |
| GET | `/:id` | Por ID o código |
| POST | `/` | Crear estación |
| PUT | `/:id` | Actualizar estación |
| PUT | `/:id/status` | Cambiar estado |
---
### 2. 🛣️ Road (Ruta)
**Archivo modelo:** `server-admin/src/roads/road.model.js`
| Campo | Tipo | Restricciones |
|---|---|---|
| `name` | String | Requerido, único, max 100 chars |
| `routeCode` | String | Requerido, único, uppercase (ej. `L1`, `L12`) |
| `typeRoad` | String (enum) | `EXPRESS`, `RELEVOS`, `CENTRALES` |
| `status` | String (enum) | `ACTIVE`, `INACTIVE`, `MAINTENANCE`, `CLOSED` |
| `stations` | `[ObjectId]` | **Ref → `Station`** (array de referencias) |
| `path` | GeoJSON LineString | Coordenadas `[[lon, lat], ...]`, mínimo 2 puntos |
| `isActive` | Boolean | Default: `true` |
| `createdAt`, `updatedAt` | Date | Auto (timestamps) |
- **Índice geoespacial:** `roadSchema.index({ path: '2dsphere' })`
- **Representa:** Una línea de servicio del transporte (recorrido completo)
**Relación clave:** `stations` es un array de `ObjectId` referenciando al modelo `Station`. Al consultar rutas, se hace `.populate('stations', 'name stationCode typeStation location')` para traer los datos de las estaciones relacionadas.
**Función auxiliar en controlador:** `processStations()` — acepta tanto ObjectIds como `stationCode` strings y los resuelve a IDs.
**Controlador:** `server-admin/src/roads/road.controller.js`
- `getRoads` — Lista con paginación + populate de stations
- `getAllRoads` — Lista completa sin paginación
- `getRoadById` — Por ObjectId **o** por `routeCode`
- `createRoad` — Crea con coordenadas LineString y lista de estaciones
- `updateRoad` — Actualiza (reconstruye GeoJSON `path` si hay coordenadas)
- `changeRoadStatus` — Cambia solo el campo `status`
**Rutas API:** `server-admin/src/roads/road.routes.js` → `/TRANSMETRO-CONECTA/v1/roads`
| Método | Ruta | Acción |
|---|---|---|
| GET | `/` | Lista con paginación y filtros |
| GET | `/all` | Lista completa sin paginación |
| GET | `/:id` | Por ID o código de ruta |
| POST | `/` | Crear ruta |
| PUT | `/:id` | Actualizar ruta |
| PUT | `/:id/status` | Cambiar estado |
---
### 3. 🚨 Alert (Alerta)
**Archivo modelo:** `server-admin/src/alerts/alert.model.js`
| Campo | Tipo | Restricciones |
|---|---|---|
| `title` | String | Requerido |
| `description` | String | Requerido |
| `typeAlert` | String (enum) | `INCIDENT`, `MAINTENANCE`, `INFO` (default: `INFO`) |
| `status` | String (enum) | `ACTIVE`, `RESOLVED` (default: `ACTIVE`) |
| `createdAt`, `updatedAt` | Date | Auto (timestamps) |
- **Representa:** Notificaciones o avisos del sistema (incidentes, mantenimientos, información)
- No tiene relaciones directas con otras entidades
**Controlador:** `server-admin/src/alerts/alert.controller.js`
- `createAlert` — Crea alerta (title, description, typeAlert)
- `getActiveAlerts` — Lista solo alertas con `status: 'ACTIVE'`, ordenadas por `createdAt -1`
- `resolveAlert` — Actualiza el campo `status` (normalmente a `RESOLVED`)
**Rutas API:** `server-admin/src/alerts/alert.routes.js` → `/TRANSMETRO-CONECTA/v1/alerts`
| Método | Ruta | Acción |
|---|---|---|
| POST | `/` | Crear alerta |
| GET | `/` | Listar alertas activas |
| PUT | `/:id/status` | Cambiar estado de alerta |
---
## Relaciones entre Entidades
```
Road ──────────────────────────── Station
  (stations: [ObjectId])           (referenced by roads)
  many-to-many vía array de refs
Alert (independiente, sin relaciones)
```
- **Road → Station:** Una ruta puede contener múltiples estaciones (`stations: [ObjectId ref 'Station']`). Las estaciones pueden pertenecer a múltiples rutas (relación many-to-many implícita).
---
## Capa de Autenticación y Seguridad
**Middleware JWT** (`server-admin/middlewares/auth-validators.js`):
- Extrae token del header `token` o `Authorization`
- Verifica contra `process.env.JWT_SECRET`
- Valida que el rol sea `Admin` (compatible con claims de .NET)
- Inyecta `req.userRole`, `req.postgresUserId`, `req.userEmail` en el request
- **Nota:** El `postgresUserId` sugiere que la autenticación/gestión de usuarios vive en un servicio externo (posiblemente .NET con PostgreSQL), y este servidor es solo el administrador de rutas/estaciones/alertas
**Utilidades** (`server-admin/src/utils/`):
- `encrypt.js` — Funciones `encrypt()` y `verifyPassword()` con Argon2 (preparadas para futura gestión de usuarios)
- `jwt.js` — Generador de JWT (preparado para gestión local futura)
---
## Middlewares de Validación
| Archivo | Propósito |
|---|---|
| `auth-validators.js` | Verificación JWT + rol Admin |
| `alerts-validators.js` | Validación body para crear/actualizar alertas |
| `roads-validators.js` | Validación body/params para CRUD de rutas |
| `stations-validators.js` | Validación body/params para CRUD de estaciones |
| `data-validators.js` | Validación de paginación (`page`, `limit`) y filtros por enum |
| `check-validators.js` | Ejecuta `validationResult()` y retorna errores 400 |
| `handle-errors.js` | Manejador global de errores (ValidationError, CastError, JWT errors, duplicados) |
| `request-limit.js` | Rate limiting: 100 requests / 15 minutos por IP |
---
## Dependencias Notables
| Paquete | Versión | Uso |
|---|---|---|
| `mongoose` | `^9.1.5` | ODM para MongoDB |
| `express` | `^5.2.1` | Framework HTTP |
| `jsonwebtoken` | `^9.0.3` | Verificación JWT |
| `express-validator` | `^7.3.1` | Validación de inputs |
| `argon2` | `^0.44.0` | Hash de contraseñas (preparado) |
| `cloudinary` + `multer` | — | Subida de archivos/imágenes (preparado, no activo) |
| `helmet` + `cors` + `express-rate-limit` | — | Seguridad HTTP |