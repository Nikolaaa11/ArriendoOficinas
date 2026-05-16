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
# Unit tests (Vitest)
npm run test          # watch
npm run test:run      # una vez (13 tests pasan)
npm run test:coverage # con coverage

# E2E (Playwright)
npm run test:e2e:install   # primera vez: descarga Chromium
npm run test:e2e
```

Unit tests cubren: validación de bookings, availability service (domingos, fechas bloqueadas, FULL), rate limiter. Playwright corre smoke sobre home, /disponibilidad, /login, /dashboard (redirige sin sesión) y login admin completo.

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
| 4 | Admin (bookings + tenants tables, tenant detail, dashboard charts, admin calendar, PricingEditor, BlockedDatesManager, PhotoManager, SiteConfigEditor + landing dinámica) | ✅ |
| 5 | Pagos (Mercado Pago SDK activo + webhook + botón pagar), email notifications, reminders cron, reportes + CSV export, vercel.json, rate limiting, profile editor, cancel booking, Playwright E2E smoke | ✅ |

### Sprint 5 — notas operativas

- **Mercado Pago:** el adapter en `src/modules/payment/mercadopago.adapter.ts` está **listo para enchufar**. Para activarlo: `npm install mercadopago`, setear `MERCADOPAGO_ACCESS_TOKEN`, y descomentar los bloques marcados. El botón **Pagar** en `/mi-cuenta/reservas/[id]` ya consume `POST /api/payments/preference` y redirige al `initPoint`.
- **Webhook:** `POST /api/webhooks/payment` actualiza `paymentStatus` cuando MP notifica. Setear la URL en MP Dashboard.
- **Cron de recordatorios:** `vercel.json` declara un cron diario a las 10:00 que llama `GET /api/cron/reminders`. Setear `CRON_SECRET` en Vercel para autenticarlo (Vercel envía `Authorization: Bearer $CRON_SECRET`).
- **Emails:** sin `RESEND_API_KEY`, los emails se loguean a consola en lugar de enviarse — útil para dev.
- **CSV:** `Reportes → Exportar CSV` baja todas las reservas con BOM UTF-8 (abre bien en Excel).
- **Tests:** 11/11 pasan. E2E con Playwright queda pendiente.

---

## 📞 Datos de la oficina (seed)

- Nombre: **Oficina Metro Manquehue**
- Dirección: Av. Manquehue Norte, Las Condes — Santiago
- Bloques: **AM** (08:00–14:00) · **PM** (14:00–20:00)
- Precios seed: lun–vie **$35.000** · sáb **$25.000** · dom cerrado
- WhatsApp: **+56 9 6303 7492**
