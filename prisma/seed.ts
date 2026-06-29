import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding LUMORA database…");

  // ─── Categories ───────────────────────────────────────────────────────────
  const [rings, necklaces, earrings, bracelets, pendants] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "rings" },
      update: {},
      create: { name: "Rings", slug: "rings", description: "From solitaire to eternity bands", sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: "necklaces" },
      update: {},
      create: { name: "Necklaces", slug: "necklaces", description: "Layered elegance for every neckline", sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: "earrings" },
      update: {},
      create: { name: "Earrings", slug: "earrings", description: "Studs, drops and chandeliers", sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: "bracelets" },
      update: {},
      create: { name: "Bracelets", slug: "bracelets", description: "Tennis, bangles and charm bracelets", sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: "pendants" },
      update: {},
      create: { name: "Pendants", slug: "pendants", description: "Personal talismans and statement pendants", sortOrder: 5 },
    }),
  ]);

  // ─── Admin user ───────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin@lumora123", 12);
  await prisma.user.upsert({
    where: { email: "admin@lumora.com" },
    update: {},
    create: {
      email: "admin@lumora.com",
      name: "LUMORA Admin",
      passwordHash: adminHash,
      role: "ADMIN",
      isVerified: true,
    },
  });

  // ─── Sample customer ──────────────────────────────────────────────────────
  const customerHash = await bcrypt.hash("customer123", 12);
  await prisma.user.upsert({
    where: { email: "priya@example.com" },
    update: {},
    create: {
      email: "priya@example.com",
      name: "Priya Sharma",
      passwordHash: customerHash,
      role: "CUSTOMER",
    },
  });

  // ─── Products ─────────────────────────────────────────────────────────────
  const products = [
    // Rings
    {
      name: "Celestial Diamond Solitaire Ring",
      slug: "celestial-diamond-solitaire-ring",
      sku: "LMR-R001",
      description: "A single round brilliant-cut diamond set in a slender 18K yellow gold band. The prong-set stone is elevated above the band to maximize light reflection from every angle.",
      story: "Inspired by a single star suspended in the night sky, this solitaire captures the essence of timeless love.",
      price: 4800,
      comparePrice: 5600,
      categoryId: rings.id,
      metalType: "YELLOW_GOLD_18K" as const,
      caratWeight: 0.5,
      gemstone: "Diamond",
      gemstoneCarats: 0.5,
      certification: "GIA",
      stock: 12,
      isFeatured: true,
      badge: "Best Seller",
      collection: "Celestial",
      engravable: true,
      sizeable: true,
      availableSizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8"],
      images: [
        { url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80", altText: "Diamond solitaire ring", isPrimary: true, sortOrder: 0 },
        { url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80", altText: "Ring close-up", isPrimary: false, sortOrder: 1 },
      ],
    },
    {
      name: "Eternal Pavé Eternity Band",
      slug: "eternal-pave-eternity-band",
      sku: "LMR-R002",
      description: "A full-circle pavé band set with 32 round brilliant diamonds totaling 1.2ct in 18K white gold. Seamless and light-catching from every direction.",
      price: 7200,
      categoryId: rings.id,
      metalType: "WHITE_GOLD_18K" as const,
      caratWeight: 1.2,
      gemstone: "Diamond",
      gemstoneCarats: 1.2,
      certification: "IGI",
      stock: 8,
      isFeatured: true,
      badge: "New Arrival",
      collection: "Eternal",
      sizeable: true,
      availableSizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"],
      images: [
        { url: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80", altText: "Pavé eternity band", isPrimary: true, sortOrder: 0 },
      ],
    },
    {
      name: "Verdant Emerald Cocktail Ring",
      slug: "verdant-emerald-cocktail-ring",
      sku: "LMR-R003",
      description: "A vivid Colombian emerald at the center, flanked by diamond baguettes in 18K yellow gold. Bold, architectural, and utterly captivating.",
      price: 8900,
      categoryId: rings.id,
      metalType: "YELLOW_GOLD_18K" as const,
      gemstone: "Emerald",
      gemstoneCarats: 2.1,
      stock: 4,
      isFeatured: true,
      badge: "Limited Edition",
      collection: "Verdant",
      sizeable: true,
      availableSizes: ["5", "6", "7", "8"],
      images: [
        { url: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80", altText: "Emerald cocktail ring", isPrimary: true, sortOrder: 0 },
      ],
    },
    // Necklaces
    {
      name: "Aurora Diamond Tennis Necklace",
      slug: "aurora-diamond-tennis-necklace",
      sku: "LMR-N001",
      description: "48 round brilliant diamonds totaling 6ct set in a continuous 18\" 18K white gold chain. The pinnacle of refined glamour.",
      price: 22000,
      comparePrice: 26000,
      categoryId: necklaces.id,
      metalType: "WHITE_GOLD_18K" as const,
      caratWeight: 6,
      gemstone: "Diamond",
      gemstoneCarats: 6,
      certification: "GIA",
      stock: 3,
      isFeatured: true,
      badge: "Signature",
      collection: "Aurora",
      images: [
        { url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80", altText: "Diamond tennis necklace", isPrimary: true, sortOrder: 0 },
      ],
    },
    {
      name: "Heritage Gold Chain Necklace",
      slug: "heritage-gold-chain-necklace",
      sku: "LMR-N002",
      description: "A handwoven 22\" curb-link chain in 18K yellow gold. Substantial weight and a satisfying gleam. Timeless masculinity and feminine power, both.",
      price: 3400,
      categoryId: necklaces.id,
      metalType: "YELLOW_GOLD_18K" as const,
      weight: 14.2,
      stock: 18,
      isFeatured: false,
      collection: "Heritage",
      images: [
        { url: "https://images.unsplash.com/photo-1573408301185-9519f94815b0?w=800&q=80", altText: "Gold chain necklace", isPrimary: true, sortOrder: 0 },
      ],
    },
    // Earrings
    {
      name: "Celestial Diamond Stud Earrings",
      slug: "celestial-diamond-stud-earrings",
      sku: "LMR-E001",
      description: "A matched pair of round brilliant diamonds (0.5ct each, 1ct total) in four-prong 18K white gold settings with butterfly push-backs.",
      price: 3600,
      categoryId: earrings.id,
      metalType: "WHITE_GOLD_18K" as const,
      caratWeight: 1,
      gemstone: "Diamond",
      gemstoneCarats: 1,
      certification: "GIA",
      stock: 24,
      isFeatured: true,
      badge: "Best Seller",
      collection: "Celestial",
      images: [
        { url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80", altText: "Diamond stud earrings", isPrimary: true, sortOrder: 0 },
      ],
    },
    {
      name: "Aurora Drop Sapphire Earrings",
      slug: "aurora-drop-sapphire-earrings",
      sku: "LMR-E002",
      description: "Pear-shaped Ceylon sapphires (1.8ct each) drop elegantly from diamond-set hooks in 18K yellow gold. Deeply saturated blue, beautifully cut.",
      price: 5800,
      categoryId: earrings.id,
      metalType: "YELLOW_GOLD_18K" as const,
      gemstone: "Sapphire",
      gemstoneCarats: 3.6,
      stock: 6,
      isFeatured: true,
      collection: "Aurora",
      images: [
        { url: "https://images.unsplash.com/photo-1632685065161-22f2e31a16ea?w=800&q=80", altText: "Sapphire drop earrings", isPrimary: true, sortOrder: 0 },
      ],
    },
    // Bracelets
    {
      name: "Eternal Diamond Tennis Bracelet",
      slug: "eternal-diamond-tennis-bracelet",
      sku: "LMR-B001",
      description: "A classic 7\" tennis bracelet with 26 round brilliant diamonds (4ct total) set in 18K white gold. The definition of wrist elegance.",
      price: 14500,
      categoryId: bracelets.id,
      metalType: "WHITE_GOLD_18K" as const,
      caratWeight: 4,
      gemstone: "Diamond",
      gemstoneCarats: 4,
      certification: "IGI",
      stock: 5,
      isFeatured: true,
      badge: "Signature",
      collection: "Eternal",
      images: [
        { url: "https://images.unsplash.com/photo-1618898946994-2a0d7b61f83e?w=800&q=80", altText: "Diamond tennis bracelet", isPrimary: true, sortOrder: 0 },
      ],
    },
    // Pendants
    {
      name: "Verdant Emerald Pendant",
      slug: "verdant-emerald-pendant",
      sku: "LMR-P001",
      description: "A hexagonal Zambian emerald (1.4ct) bezel-set in 18K gold with a fine 18\" trace chain. Architectural and serene.",
      price: 4200,
      categoryId: pendants.id,
      metalType: "YELLOW_GOLD_14K" as const,
      gemstone: "Emerald",
      gemstoneCarats: 1.4,
      stock: 9,
      isFeatured: true,
      collection: "Verdant",
      images: [
        { url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80", altText: "Emerald pendant", isPrimary: true, sortOrder: 0 },
      ],
    },
    {
      name: "Celestial Pearl Drop Pendant",
      slug: "celestial-pearl-drop-pendant",
      sku: "LMR-P002",
      description: "A lustrous Akoya pearl (9mm) suspended from a pavé diamond bail in 18K rose gold. Soft, feminine, and utterly refined.",
      price: 2800,
      categoryId: pendants.id,
      metalType: "ROSE_GOLD_18K" as const,
      gemstone: "Pearl",
      stock: 15,
      collection: "Celestial",
      isFeatured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1638032432997-3b3b34e69c0e?w=800&q=80", altText: "Pearl drop pendant", isPrimary: true, sortOrder: 0 },
      ],
    },
  ];

  for (const { images, ...product } of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        images: { create: images },
      },
    });
    process.stdout.write(`  ✓ ${product.name}\n`);
  }

  // ─── Coupons ──────────────────────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrderValue: 500,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "LUMORA500" },
    update: {},
    create: {
      code: "LUMORA500",
      type: "FIXED",
      value: 500,
      minOrderValue: 3000,
      maxUses: 100,
      isActive: true,
    },
  });

  console.log("\n✅ Seed complete!");
  console.log("   Admin: admin@lumora.com / admin@lumora123");
  console.log("   Customer: priya@example.com / customer123");
  console.log("   Coupons: WELCOME10 (10% off $500+) · LUMORA500 ($500 off $3000+)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
