# Dashboard interactivo 9/11 + dataset Mongo

Proyecto base en **Next.js 14 + TypeScript + Docker** con un **dashboard interactivo** y un **dataset enriquecido listo para importar en MongoDB**.

## Qué incluye

- Timeline interactivo de los eventos del 11 de septiembre de 2001
- KPIs principales
- Tabla de eventos
- Gráfica por tipo de evento
- API local (`/api/events`)
- Dataset listo para MongoDB en `data/mongo`
- Script de importación a Mongo

---

## Stack

- Next.js 14
- React 18
- TypeScript
- Recharts
- MongoDB
- Docker / Docker Compose

---

## Estructura

```bash
.
├── app/
│   ├── api/events/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── Dashboard.tsx
├── data/
│   └── mongo/
│       ├── events.json
│       ├── locations.json
│       └── metrics.json
├── lib/
│   └── data.ts
├── scripts/
│   └── import_mongo.js
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Ejecución local sin Docker

```bash
npm install
npm run dev
```

Abrir en:
```bash
http://localhost:3000
```

---

## Ejecución con Docker

```bash
docker compose up --build
```

App:
```bash
http://localhost:3000
```

Mongo:
```bash
mongodb://localhost:27017
```

---

## Importar dataset a Mongo

### Opción 1: usando el script Node

```bash
export MONGODB_URI="mongodb://localhost:27017"
export MONGODB_DB="nine_eleven"
npm run import:mongo
```

### Opción 2: usando mongoimport

```bash
mongoimport --uri="mongodb://localhost:27017" --db=nine_eleven --collection=events --jsonArray --file=data/mongo/events.json
mongoimport --uri="mongodb://localhost:27017" --db=nine_eleven --collection=locations --jsonArray --file=data/mongo/locations.json
mongoimport --uri="mongodb://localhost:27017" --db=nine_eleven --collection=metrics --jsonArray --file=data/mongo/metrics.json
```

---

## Modelo de datos

### events
Evento individual del timeline:
- `event_id`
- `timestamp_local`
- `timestamp_utc`
- `title`
- `type`
- `location_id`
- `sequence`
- `fatalities_estimated`
- `summary`
- `tags`

### locations
Ubicaciones relevantes:
- `location_id`
- `name`
- `city`
- `state`
- `country`
- `lat`
- `lng`

### metrics
Métricas agregadas:
- `metric_key`
- `value`
- `unit`
- `notes`

---

## Deploy sugerido

### Vercel
Ideal si quieres solo frontend.

### Docker en VPS / EC2 / ECS
Ideal si quieres app + Mongo + control total.

### Siguiente nivel
- Agregar mapa con Mapbox
- Agregar filtro por categoría
- Agregar narrativa automática del timeline
- Consumir datos desde Mongo real en vez de JSON local
- Agregar autenticación para modo académico / premium

---

## Nota de datos
El dataset incluido está orientado a un **uso educativo y analítico**. Está modelado para consulta cronológica, visualización y explotación en MongoDB.
