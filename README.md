# BLOQUE — Plataforma de Arriendo de Oficinas

Plataforma SaaS para arriendo de oficinas por bloques horarios AM/PM. Stack: Next.js 16 + React 19 + TypeScript + Prisma + NextAuth v5 + Tailwind v4 + Resend.

**Tema visual:** Midnight Ember (dark por defecto, con toggle a light).
**Especificación completa:** ver [`CLAUDE.md`](./CLAUDE.md).

---

## 🚀 Quick start (Windows / PowerShell)

```powershell
# 1. Instalar dependencias
npm install --legacy-peer-deps

# 2. Crear la base de datos (SQLite, archivo local)
npx prisma db push
npx prisma db seed

# 3. Levantar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## 🔑 Credenciales por defecto (seed)

| Rol | Email | Password |
|-----|-------|----------|
| Admin | `admin@bloque.cl` | `bloque2026` |

**Cámbiala en producción.** El seed solo se ejecuta una vez.

---

## 🗺️ Rutas principales

### Público
- `/` — Landing (hero, beneficios, amenidades, galería, precios, mapa, contacto)
- `/disponibilidad` — Calendario público con bloques AM/PM
- `/galeria` — Galería de fotos
- `/contacto` — Formulario de contacto

### Auth
- `/login` — Ingresar
- `/register` — Crear cuenta

### Portal arrendatario (requiere sesión)
- `/mi-cuenta` — Resumen personal
- `/reservar` — Stepper de reserva (3 pasos: fecha → bloque → confirmar)
- `/mi-cuenta/mis-reservas` — Tabla con historial
- `/mi-cuenta/reservas/[id]` — Detalle de reserva
- `/mi-cuenta/perfil` — Editar datos

### Admin (requiere rol ADMIN o SUPER_ADMIN)
- `/dashboard` — Stats + últimas reservas
- `/dashboard/reservas` — Tabla con filtros y acciones (aprobar / cancelar / marcar pagado)
- `/dashboard/arrendatarios` — Listado con historial y WhatsApp
- `/dashboard/calendario`, `/dashboard/reportes`, `/dashboard/configuracion` — Stub (Sprint 4/5)

### API
- `POST /api/auth/register`
- `GET /api/availability?month=YYYY-MM&officeId=...`
- `POST /api/contact`
- `POST /api/bookings` (crea reserva — auth)
- `GET /api/bookings` (mis reservas)
- `GET /api/bookings/[id]`
- `PATCH /api/bookings/[id]/cancel`
- `GET /api/admin/bookings?status=...` (admin)
- `PATCH /api/admin/bookings/[id]` (admin)

---

## 🗄️ Base de datos

**Dev (default):** SQLite (`prisma/dev.db`).
**Prod (recomendado):** PostgreSQL (Supabase, Neon, Railway).

Para cambiar a Postgres:

1. En `prisma/schema.prisma` cambiar:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Convertir los dos campos `String` que guardan JSON (`SiteConfig.value`, `AuditLog.metadata`) a `Json`.
3. Setear `DATABASE_URL` con tu connection string.
4. `npx prisma migrate dev --name init` (genera migraciones).
5. `npx prisma db seed`.

---

## 🌱 Variables de entorno

Copiar `.env.example` a `.env.local` y completar. El mínimo para correr el sitio es `DATABASE_URL` + `NEXTAUTH_SECRET`. Para emails reales se necesita `RESEND_API_KEY` (sin él, los emails se loguean a consola).

---

## 🧪 Tests

```powershell
npm run test          # watch
npm run test:run      # una vez
npm run test:coverage # con coverage
```

---

## 📦 Build de producción

```powershell
npm run build
npm run start
```

---

## 🚢 Deploy en Vercel

1. Conectar el repo `Nikolaaa11/ArriendoOficinas` en [vercel.com/new](https://vercel.com/new).
2. Configurar env vars en Settings → Environment Variables (mismas que `.env.local` pero con `DATABASE_URL` apuntando a Postgres).
3. Deploy.

---

## 📐 Arquitectura

Hexagonal simplificada:

```
src/
├── app/                          # UI (App Router)
├── modules/                      # Dominio puro (booking, availability, notification, ...)
├── infrastructure/               # Prisma, NextAuth, adapters
├── components/                   # UI compartida
├── lib/ · config/ · types/       # Utilidades
```

Regla de oro: **`modules/` nunca importa de `infrastructure/`**. El dominio define interfaces; la infra las implementa.

---

## ✅ Estado de sprints

| Sprint | Descripción | Estado |
|--------|------------|--------|
| 1 | Fundación (scaffold, schema, auth, layouts, theme) | ✅ |
| 2 | Landing + Disponibilidad + Contacto | ✅ |
| 3 | Reservas (stepper, portal, mis reservas, detalle) | ✅ |
| 4 | Admin (bookings table, arrendatarios, charts, config editors) | 🟡 Parcial (table + tenants done; calendar / pricing editor / photo manager pending) |
| 5 | Pagos (Mercado Pago), reminders, reportes, E2E, deploy | ⏳ |

---

## 📞 Datos de la oficina (seed)

- Nombre: **Oficina Metro Manquehue**
- Dirección: Av. Manquehue Norte, Las Condes — Santiago
- Bloques: **AM** (08:00–14:00) · **PM** (14:00–20:00)
- Precios seed: lun–vie **$35.000** · sáb **$25.000** · dom cerrado
- WhatsApp: **+56 9 6303 7492**
