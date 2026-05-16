import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ───── Office ─────
  const office = await prisma.office.upsert({
    where: { slug: "oficina-metro-manquehue" },
    update: {},
    create: {
      slug: "oficina-metro-manquehue",
      name: "Oficina Metro Manquehue",
      description:
        "Oficina profesional a pasos del Metro Manquehue. Ideal para profesionales que reciben clientes.",
      address: "Av. Manquehue Norte, Las Condes — Santiago",
      floor: "Piso 4",
      latitude: -33.4156,
      longitude: -70.5673,
      capacity: 4,
      isActive: true,
    },
  });

  // ───── Amenities ─────
  const amenityNames = [
    { name: "WiFi alta velocidad", icon: "Wifi" },
    { name: "Kitchenette", icon: "Coffee" },
    { name: "Sala de espera", icon: "Sofa" },
    { name: "Escritorio profesional", icon: "BriefcaseBusiness" },
    { name: "Dirección comercial", icon: "Mail" },
  ];

  for (const a of amenityNames) {
    const amenity = await prisma.amenity.upsert({
      where: { name: a.name },
      update: { icon: a.icon },
      create: { name: a.name, icon: a.icon },
    });
    await prisma.officeAmenity.upsert({
      where: { officeId_amenityId: { officeId: office.id, amenityId: amenity.id } },
      update: {},
      create: { officeId: office.id, amenityId: amenity.id },
    });
  }

  // ───── Blocks ─────
  const am = await prisma.block.upsert({
    where: { id: "block-am-seed" },
    update: {},
    create: {
      id: "block-am-seed",
      officeId: office.id,
      type: "AM",
      label: "Mañana",
      startTime: "08:00",
      endTime: "14:00",
      isActive: true,
    },
  });
  const pm = await prisma.block.upsert({
    where: { id: "block-pm-seed" },
    update: {},
    create: {
      id: "block-pm-seed",
      officeId: office.id,
      type: "PM",
      label: "Tarde",
      startTime: "14:00",
      endTime: "20:00",
      isActive: true,
    },
  });

  // ───── Pricing: 1..5 weekdays = 35000, saturday = 25000, sunday closed (no pricing) ─────
  for (const block of [am, pm]) {
    for (let dow = 1; dow <= 6; dow++) {
      const price = dow === 6 ? 25000 : 35000;
      await prisma.pricing.upsert({
        where: {
          blockId_dayOfWeek_validFrom: {
            blockId: block.id,
            dayOfWeek: dow,
            validFrom: new Date("2024-01-01T00:00:00Z"),
          },
        },
        update: { price },
        create: {
          blockId: block.id,
          dayOfWeek: dow,
          price,
          currency: "CLP",
          validFrom: new Date("2024-01-01T00:00:00Z"),
        },
      });
    }
  }

  // ───── Admin user ─────
  const passwordHash = await bcrypt.hash("bloque2026", 10);
  await prisma.user.upsert({
    where: { email: "admin@bloque.cl" },
    update: { role: "ADMIN", passwordHash },
    create: {
      email: "admin@bloque.cl",
      name: "Admin BLOQUE",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Seed completo.");
  console.log("   Admin: admin@bloque.cl / bloque2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
