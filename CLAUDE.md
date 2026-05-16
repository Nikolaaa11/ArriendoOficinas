# 🏢 BLOQUE — Plataforma de Arriendo de Oficinas por Bloques Horarios
## MEGA PROMPT DE ARQUITECTURA v2.0

---

## 0. IDENTIDAD DEL PROYECTO

**Nombre:** BLOQUE
**Tagline:** "Tu oficina, a tu hora"
**Dominio:** bloque.cl (futuro)
**Propósito:** Plataforma SaaS para gestionar el arriendo de oficinas y espacios profesionales por bloques horarios AM/PM, con calendario en tiempo real, pagos integrados, y panel administrativo completo.

---

## 1. PALETA DE DISEÑO — "Midnight Ember"

Nada de teal genérico. Esta paleta es dark, cálida y sofisticada.

```
--color-bg-primary:     #0C0C0F;       /* Fondo principal — casi negro */
--color-bg-secondary:   #161619;       /* Cards, sidebars */
--color-bg-elevated:    #1E1E23;       /* Modals, dropdowns */
--color-bg-surface:     #26262D;       /* Inputs, hover states */

--color-accent-primary: #E8734A;       /* Coral ember — CTAs, highlights */
--color-accent-hover:   #F2895F;       /* Hover del accent */
--color-accent-muted:   #E8734A1A;     /* Background tintado 10% */

--color-gold:           #C4A265;       /* Premium accent — badges, precios */
--color-gold-muted:     #C4A2651A;     /* Tinted backgrounds */

--color-success:        #34D399;       /* Disponible, confirmado, pagado */
--color-warning:        #FBBF24;       /* Pendiente */
--color-danger:         #F87171;       /* Cancelado, error */

--color-text-primary:   #F0EDE8;       /* Texto principal — warm white */
--color-text-secondary: #9B978F;       /* Texto secundario */
--color-text-tertiary:  #5C5A55;       /* Placeholders, hints */

--color-border:         #2A2A31;       /* Bordes sutiles */
--color-border-hover:   #3A3A43;       /* Bordes hover */

/* Variante Light (toggle) */
--light-bg-primary:     #FAFAF7;
--light-bg-secondary:   #F0EDEA;
--light-text-primary:   #1A1A1F;
--light-text-secondary: #6B6860;
```

**Tipografía (Google Fonts):**
```
--font-display: 'Outfit', sans-serif;           /* Headings — geométrica, moderna */
--font-body: 'DM Sans', sans-serif;             /* Body text — legible, profesional */
--font-mono: 'JetBrains Mono', monospace;       /* Código, precios, datos */
```

**Radios y Spacing:**
```
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;

/* 4px base grid system */
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-5: 20px;  --space-6: 24px;
--space-8: 32px;  --space-10: 40px; --space-12: 48px;
--space-16: 64px; --space-20: 80px; --space-24: 96px;
```

---

## 2. ARQUITECTURA MODULAR — HEXAGONAL SIMPLIFICADA

```
src/
├── app/                          # Next.js App Router (UI Layer)
│   ├── (marketing)/              # Grupo: landing, galería, contacto
│   │   ├── page.tsx              # Landing page
│   │   ├── galeria/page.tsx
│   │   ├── disponibilidad/page.tsx
│   │   └── contacto/page.tsx
│   ├── (auth)/                   # Grupo: login, register
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Grupo: admin panel (protegido)
│   │   ├── layout.tsx            # Sidebar + topbar admin
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── reservas/page.tsx
│   │   ├── calendario/page.tsx
│   │   ├── arrendatarios/page.tsx
│   │   ├── configuracion/page.tsx
│   │   └── reportes/page.tsx
│   ├── (portal)/                 # Grupo: portal arrendatario (protegido)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Mi cuenta
│   │   ├── mis-reservas/page.tsx
│   │   └── perfil/page.tsx
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── bookings/route.ts
│   │   ├── bookings/[id]/route.ts
│   │   ├── availability/route.ts
│   │   ├── contact/route.ts
│   │   ├── admin/
│   │   │   ├── bookings/route.ts
│   │   │   ├── tenants/route.ts
│   │   │   ├── pricing/route.ts
│   │   │   ├── blocked-dates/route.ts
│   │   │   └── stats/route.ts
│   │   └── webhooks/
│   │       └── payment/route.ts
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── modules/                      # 🧩 MÓDULOS DE DOMINIO (core business)
│   ├── booking/
│   │   ├── booking.entity.ts         # Entidad de dominio
│   │   ├── booking.repository.ts     # Interface del repositorio
│   │   ├── booking.service.ts        # Lógica de negocio pura
│   │   ├── booking.validation.ts     # Schemas Zod
│   │   ├── booking.types.ts          # Types/interfaces
│   │   ├── booking.errors.ts         # Errores de dominio
│   │   └── __tests__/
│   │       ├── booking.service.test.ts
│   │       └── booking.validation.test.ts
│   ├── availability/
│   │   ├── availability.service.ts   # Cálculo de disponibilidad
│   │   ├── availability.types.ts
│   │   └── __tests__/
│   ├── pricing/
│   │   ├── pricing.service.ts        # Cálculo de precios
│   │   ├── pricing.types.ts
│   │   └── __tests__/
│   ├── tenant/
│   │   ├── tenant.entity.ts
│   │   ├── tenant.repository.ts
│   │   ├── tenant.service.ts
│   │   ├── tenant.validation.ts
│   │   └── __tests__/
│   ├── notification/
│   │   ├── notification.service.ts   # Orquesta email + WhatsApp
│   │   ├── notification.types.ts
│   │   ├── email.adapter.ts          # Adapter para Resend
│   │   ├── whatsapp.adapter.ts       # Adapter para WhatsApp API
│   │   └── templates/
│   │       ├── booking-confirmed.tsx  # React Email template
│   │       ├── booking-reminder.tsx
│   │       └── payment-received.tsx
│   ├── payment/
│   │   ├── payment.service.ts
│   │   ├── payment.types.ts
│   │   ├── mercadopago.adapter.ts    # Adapter Mercado Pago
│   │   └── __tests__/
│   └── analytics/
│       ├── analytics.service.ts      # Reportes y stats
│       └── analytics.types.ts
│
├── infrastructure/               # 🔌 CAPA DE INFRAESTRUCTURA
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── booking.repository.impl.ts    # Implementación Prisma
│   │   ├── tenant.repository.impl.ts
│   │   └── prisma-client.ts              # Singleton
│   ├── auth/
│   │   ├── auth.config.ts                # NextAuth config
│   │   ├── auth.middleware.ts            # Protección de rutas
│   │   └── auth.utils.ts                # Helpers (getSession, requireAuth)
│   ├── storage/
│   │   └── upload.service.ts             # Subida de fotos
│   └── cache/
│       └── cache.service.ts              # Cache layer (futuro Redis)
│
├── components/                   # 🎨 COMPONENTES UI
│   ├── ui/                       # shadcn/ui base (button, input, etc.)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── MobileNav.tsx
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── BenefitsGrid.tsx
│   │   ├── AmenitiesList.tsx
│   │   ├── PricingTable.tsx
│   │   ├── TestimonialCarousel.tsx
│   │   ├── ContactForm.tsx
│   │   ├── WhatsAppButton.tsx
│   │   └── MapEmbed.tsx
│   ├── booking/
│   │   ├── AvailabilityCalendar.tsx
│   │   ├── BlockSelector.tsx
│   │   ├── BookingForm.tsx
│   │   ├── BookingCard.tsx
│   │   ├── BookingStatusBadge.tsx
│   │   └── BookingConfirmation.tsx
│   ├── dashboard/
│   │   ├── StatsCards.tsx
│   │   ├── OccupancyChart.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── RecentBookings.tsx
│   │   ├── BookingsTable.tsx
│   │   ├── TenantsTable.tsx
│   │   ├── PricingEditor.tsx
│   │   ├── BlockedDatesManager.tsx
│   │   └── PhotoManager.tsx
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       ├── ConfirmDialog.tsx
│       ├── ThemeToggle.tsx
│       └── PageHeader.tsx
│
├── hooks/                        # Custom React Hooks
│   ├── useBookings.ts
│   ├── useAvailability.ts
│   ├── useAuth.ts
│   ├── usePricing.ts
│   └── useMediaQuery.ts
│
├── lib/                          # Utilidades compartidas
│   ├── utils.ts                  # cn(), formatCurrency(), etc.
│   ├── constants.ts              # Block types, status enums, config
│   ├── dates.ts                  # Helpers de date-fns
│   ├── validators.ts             # Zod schemas compartidos
│   └── api-client.ts             # Fetch wrapper tipado
│
├── config/                       # Configuración global
│   ├── site.ts                   # Metadata, URLs, nombre
│   ├── navigation.ts             # Menu items por rol
│   └── env.ts                    # Env validation con Zod
│
└── types/                        # Types globales
    ├── index.ts
    ├── api.ts                    # API request/response types
    └── next-auth.d.ts            # Extensión de tipos NextAuth
```

---

## 3. PRINCIPIOS DE ARQUITECTURA

### 3.1 Desacople Estratégico
```
┌─────────────────────────────────────────────────────┐
│  UI LAYER (app/, components/)                        │
│  Solo renderiza. No tiene lógica de negocio.         │
│  Llama a services vía API routes o server actions.   │
├─────────────────────────────────────────────────────┤
│  APPLICATION LAYER (api/, server actions)             │
│  Orquesta: valida input → llama service → responde.  │
│  No tiene lógica de negocio propia.                  │
├─────────────────────────────────────────────────────┤
│  DOMAIN LAYER (modules/)                             │
│  Lógica de negocio PURA. Sin dependencias externas.  │
│  Testeable con mocks simples. Portable.              │
├─────────────────────────────────────────────────────┤
│  INFRASTRUCTURE LAYER (infrastructure/)              │
│  Prisma, Resend, MercadoPago, Storage.               │
│  Implementa las interfaces del dominio.              │
└─────────────────────────────────────────────────────┘
```

### 3.2 Reglas de Dependencia
- **UI → API → Domain → (nada)**
- **Infrastructure implementa interfaces del Domain**
- **Domain NUNCA importa de Infrastructure**
- **Un módulo NO importa de otro módulo directamente** (usa servicios compartidos)

### 3.3 Patrones Clave
| Patrón | Dónde | Para qué |
|--------|-------|----------|
| Repository | modules/*/repository.ts | Abstrae acceso a datos |
| Service | modules/*/service.ts | Lógica de negocio pura |
| Adapter | modules/notification/, payment/ | Abstrae servicios externos |
| Factory | modules/booking/booking.entity.ts | Crea entidades validadas |
| Strategy | modules/pricing/ | Diferentes modelos de precio |
| Observer | modules/notification/ | Notifica tras eventos |

---

## 4. MODELO DE DATOS (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════
// USUARIOS Y AUTENTICACIÓN
// ═══════════════════════════════════════

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  image         String?
  phone         String?
  rut           String?   @unique
  profession    String?
  company       String?
  role          Role      @default(TENANT)
  isActive      Boolean   @default(true)

  bookings      Booking[]
  accounts      Account[]
  sessions      Session[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
  @@index([role])
}

enum Role {
  SUPER_ADMIN
  ADMIN
  TENANT
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ═══════════════════════════════════════
// OFICINAS Y ESPACIOS
// ═══════════════════════════════════════

model Office {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  address     String
  floor       String?
  latitude    Float?
  longitude   Float?
  capacity    Int      @default(1)
  isActive    Boolean  @default(true)

  photos      Photo[]
  blocks      Block[]
  amenities   OfficeAmenity[]
  blockedDates BlockedDate[]
  bookings    Booking[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([isActive])
}

model Photo {
  id       String  @id @default(cuid())
  url      String
  alt      String?
  caption  String?
  order    Int     @default(0)
  officeId String
  office   Office  @relation(fields: [officeId], references: [id], onDelete: Cascade)

  @@index([officeId])
  @@orderBy([order(Asc)])
}

model Amenity {
  id      String          @id @default(cuid())
  name    String          @unique
  icon    String?         // Lucide icon name
  offices OfficeAmenity[]
}

model OfficeAmenity {
  officeId  String
  amenityId String
  office    Office  @relation(fields: [officeId], references: [id], onDelete: Cascade)
  amenity   Amenity @relation(fields: [amenityId], references: [id], onDelete: Cascade)

  @@id([officeId, amenityId])
}

// ═══════════════════════════════════════
// BLOQUES Y PRECIOS
// ═══════════════════════════════════════

model Block {
  id        String    @id @default(cuid())
  type      BlockType
  label     String    // "Mañana", "Tarde"
  startTime String    // "08:00"
  endTime   String    // "14:00"
  isActive  Boolean   @default(true)

  officeId  String
  office    Office    @relation(fields: [officeId], references: [id], onDelete: Cascade)
  pricing   Pricing[]
  bookings  Booking[]

  @@index([officeId, type])
}

enum BlockType {
  AM
  PM
  FULL // Día completo (futuro)
}

model Pricing {
  id        String @id @default(cuid())
  blockId   String
  block     Block  @relation(fields: [blockId], references: [id], onDelete: Cascade)
  dayOfWeek Int    // 0=domingo ... 6=sábado
  price     Int    // CLP sin decimales
  currency  String @default("CLP")

  validFrom DateTime @default(now())
  validTo   DateTime?

  @@unique([blockId, dayOfWeek, validFrom])
  @@index([blockId])
}

// ═══════════════════════════════════════
// RESERVAS
// ═══════════════════════════════════════

model Booking {
  id            String        @id @default(cuid())
  code          String        @unique @default(cuid()) // Código legible: BLQ-XXXXX
  date          DateTime      // Fecha del bloque (solo fecha, sin hora)
  status        BookingStatus @default(PENDING)

  userId        String
  user          User          @relation(fields: [userId], references: [id])
  blockId       String
  block         Block         @relation(fields: [blockId], references: [id])
  officeId      String
  office        Office        @relation(fields: [officeId], references: [id])

  // Pago
  totalPrice    Int?
  paymentStatus PaymentStatus @default(PENDING)
  paymentRef    String?       // ID externo de MercadoPago
  paymentMethod String?
  paidAt        DateTime?

  // Metadata
  notes         String?
  adminNotes    String?
  cancelReason  String?
  cancelledAt   DateTime?
  confirmedAt   DateTime?

  // Recurrencia
  isRecurring   Boolean       @default(false)
  recurringId   String?       // Agrupa reservas recurrentes
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@unique([date, blockId, officeId])  // Un bloque por fecha por oficina
  @@index([userId])
  @@index([officeId, date])
  @@index([status])
  @@index([date, status])
  @@index([recurringId])
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}

enum PaymentStatus {
  PENDING
  PAID
  PARTIAL
  REFUNDED
  WAIVED
}

model BlockedDate {
  id       String   @id @default(cuid())
  date     DateTime
  reason   String?
  officeId String
  office   Office   @relation(fields: [officeId], references: [id], onDelete: Cascade)

  @@unique([date, officeId])
  @@index([officeId, date])
}

// ═══════════════════════════════════════
// CONFIGURACIÓN Y AUDIT
// ═══════════════════════════════════════

model SiteConfig {
  id    String @id @default(cuid())
  key   String @unique
  value Json
  updatedAt DateTime @updatedAt
}

model AuditLog {
  id        String   @id @default(cuid())
  action    String   // "booking.created", "booking.confirmed", etc.
  entity    String   // "Booking", "User", etc.
  entityId  String
  userId    String?
  metadata  Json?
  createdAt DateTime @default(now())

  @@index([entity, entityId])
  @@index([userId])
  @@index([createdAt])
}
```

---

## 5. SERVICIOS DE DOMINIO — CONTRATOS

### booking.service.ts
```typescript
interface IBookingService {
  create(input: CreateBookingInput): Promise<Result<Booking, BookingError>>;
  confirm(id: string, adminId: string): Promise<Result<Booking, BookingError>>;
  cancel(id: string, reason: string, userId: string): Promise<Result<Booking, BookingError>>;
  complete(id: string): Promise<Result<Booking, BookingError>>;
  getById(id: string): Promise<Booking | null>;
  getByUser(userId: string, filters?: BookingFilters): Promise<PaginatedResult<Booking>>;
  getByDateRange(officeId: string, from: Date, to: Date): Promise<Booking[]>;
  createRecurring(input: CreateRecurringInput): Promise<Result<Booking[], BookingError>>;
}
```

### availability.service.ts
```typescript
interface IAvailabilityService {
  getAvailability(officeId: string, month: Date): Promise<DayAvailability[]>;
  isBlockAvailable(officeId: string, blockId: string, date: Date): Promise<boolean>;
  getNextAvailable(officeId: string, blockType: BlockType): Promise<Date | null>;
}
```

### pricing.service.ts
```typescript
interface IPricingService {
  calculatePrice(blockId: string, date: Date): Promise<number>;
  getPricingMatrix(officeId: string): Promise<PricingMatrix>;
  updatePricing(blockId: string, dayOfWeek: number, price: number): Promise<Pricing>;
}
```

---

## 6. STACK TÉCNICO

```
Runtime:        Node.js 20+
Framework:      Next.js 14+ (App Router)
Language:       TypeScript 5+ (strict mode)
Styling:        Tailwind CSS 3.4+ + CSS variables
Components:     shadcn/ui + Radix UI primitives
State:          React Server Components + nuqs (URL state)
Forms:          React Hook Form + Zod
DB:             PostgreSQL 15+ (Supabase / Neon)
ORM:            Prisma 5+
Auth:           NextAuth.js v5 (Auth.js)
Email:          Resend + React Email
Payments:       Mercado Pago SDK (Chile)
Maps:           Google Maps Embed / Mapbox
Charts:         Recharts
Calendar:       react-day-picker
Storage:        Supabase Storage / Uploadthing
Testing:        Vitest + React Testing Library + Playwright
Linting:        ESLint + Prettier + typescript-eslint
Deploy:         Vercel (preview + production)
CI/CD:          GitHub Actions
Monitoring:     Vercel Analytics + Sentry (futuro)
```

---

## 7. REGLAS DE TESTING

```
tests/
├── unit/              # Vitest — modules/*/service.ts
├── integration/       # Vitest — API routes con DB mock
├── e2e/               # Playwright — flujos críticos
└── fixtures/          # Datos de prueba compartidos
```

**Mínimo exigido:**
- Todo service del dominio tiene ≥80% coverage
- Todo API route tiene test de happy path + error path
- E2E: flujo completo de reserva (ver → seleccionar → reservar → confirmar)
- E2E: login admin → aprobar reserva → ver dashboard

**Convenciones de test:**
```typescript
// Naming: describe("ServiceName") > it("should verb when condition")
describe("BookingService", () => {
  it("should create a booking when block is available", async () => {});
  it("should throw BlockNotAvailable when block is taken", async () => {});
  it("should send notification after confirmation", async () => {});
});
```

---

## 8. CONVENCIONES DE CÓDIGO

### Naming
- **Files:** kebab-case (`booking.service.ts`, `stats-cards.tsx`)
- **Components:** PascalCase (`BookingCard.tsx` → `export function BookingCard()`)
- **Hooks:** camelCase con `use` prefix (`useBookings.ts`)
- **Types/Interfaces:** PascalCase, prefijo `I` solo para interfaces de repositorio
- **Enums:** PascalCase members (`BookingStatus.Confirmed`)
- **Constants:** SCREAMING_SNAKE (`MAX_BOOKINGS_PER_DAY`)
- **API routes:** kebab-case paths (`/api/admin/blocked-dates`)

### Imports
```typescript
// Orden: 1) React/Next 2) External libs 3) Internal modules 4) Components 5) Types
import { useState } from "react";
import { format } from "date-fns";
import { bookingService } from "@/modules/booking/booking.service";
import { BookingCard } from "@/components/booking/BookingCard";
import type { Booking } from "@/modules/booking/booking.types";
```

### Error Handling
```typescript
// Result pattern para servicios de dominio
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

// API responses estandarizadas
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
  meta?: { page: number; total: number; pageSize: number };
};
```

### Component Pattern
```typescript
// Server Component (default)
export async function BookingsPage() {
  const bookings = await bookingService.getAll();
  return <BookingsTable data={bookings} />;
}

// Client Component (solo cuando necesita interactividad)
"use client";
export function BookingForm({ blocks }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  // ...
}
```

---

## 9. SEGURIDAD

- **Auth middleware** en todas las rutas protegidas (`/(dashboard)`, `/(portal)`, `/api/admin/*`)
- **RBAC:** SUPER_ADMIN > ADMIN > TENANT — verificación en cada API route
- **Rate limiting** en `/api/bookings` y `/api/contact` (upstash/ratelimit)
- **CSRF protection** vía NextAuth
- **Input validation** con Zod en TODA entrada (body, params, query)
- **SQL injection** prevenido por Prisma (parameterized queries)
- **XSS** prevenido por React (auto-escape) + sanitización de inputs HTML
- **Secrets** en `.env.local` — NUNCA en código. Validar con `config/env.ts`

---

## 10. PRIORIDADES DE DESARROLLO

### SPRINT 1 — Fundación (Semana 1)
- [ ] Scaffold Next.js + Prisma + Auth + shadcn/ui
- [ ] Schema DB + seed data
- [ ] Auth: login/register con email (NextAuth)
- [ ] Layout base: Navbar, Footer, Sidebar admin
- [ ] Theme system (dark/light toggle)
- [ ] Config de env validation

### SPRINT 2 — Landing + Disponibilidad (Semana 2)
- [ ] Landing page completa (Hero, galería, beneficios, amenidades, precios, mapa, contacto)
- [ ] Componente AvailabilityCalendar (público)
- [ ] API: GET /api/availability?office=X&month=YYYY-MM
- [ ] Página /disponibilidad
- [ ] WhatsApp button flotante
- [ ] SEO: metadata, OG images

### SPRINT 3 — Reservas (Semana 3)
- [ ] BookingForm + BlockSelector
- [ ] API: POST /api/bookings (crear reserva)
- [ ] API: GET /api/bookings (mis reservas)
- [ ] Email de confirmación (Resend + React Email)
- [ ] Página de confirmación post-reserva
- [ ] Portal arrendatario: mis reservas, perfil

### SPRINT 4 — Admin Panel (Semana 4)
- [ ] Dashboard con StatsCards + charts
- [ ] BookingsTable con filtros y acciones (aprobar, cancelar)
- [ ] Calendario admin con drag & drop
- [ ] TenantsTable con historial
- [ ] PricingEditor
- [ ] BlockedDatesManager
- [ ] PhotoManager (upload + reorder)

### SPRINT 5 — Pagos + Polish (Semana 5)
- [ ] Integración Mercado Pago
- [ ] Webhook de pago confirmado
- [ ] Notificaciones automáticas (24h antes)
- [ ] Reportes de ocupación e ingresos
- [ ] Tests E2E flujos críticos
- [ ] Performance: ISR en landing, lazy loading
- [ ] Deploy a Vercel

---

## 11. ENV VARIABLES

```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# Auth providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Email
RESEND_API_KEY="..."
EMAIL_FROM="reservas@bloque.cl"

# Payments
MERCADOPAGO_ACCESS_TOKEN="..."
MERCADOPAGO_PUBLIC_KEY="..."
MERCADOPAGO_WEBHOOK_SECRET="..."

# Storage
SUPABASE_URL="..."
SUPABASE_ANON_KEY="..."

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY="..."

# WhatsApp
WHATSAPP_NUMBER="+56963037492"

# Site
NEXT_PUBLIC_SITE_URL="https://bloque.cl"
NEXT_PUBLIC_SITE_NAME="BLOQUE"
```
