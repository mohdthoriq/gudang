/**
 * prisma/seed.ts
 *
 * Database seeder – inventory management
 * Menggunakan @faker-js/faker (locale id_ID)
 *
 * Setup:
 *   npm install -D @faker-js/faker ts-node
 *
 * package.json:
 *   "prisma": { "seed": "ts-node prisma/seed.ts" }
 *
 * Jalankan:
 *   npx prisma db seed
 */

import { PrismaClient } from "./generated/client";
import { faker } from "@faker-js/faker/locale/id_ID";
import prisma from "@/lib/prisma"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple<T>(arr: readonly T[], min: number, max: number): T[] {
  const n       = faker.number.int({ min, max });
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(n, arr.length));
}

/** Buat SKU unik: PREFIX-XXXXX */
function makeSku(prefix: string, id: number): string {
  return `${prefix}-${String(id).padStart(5, "0")}`;
}

// ─── Data pools ───────────────────────────────────────────────────────────────

// GROUPS — divisi bisnis / brand line
const GROUP_NAMES = [
  "Pria",
  "Wanita",
  "Anak-Anak",
  "Unisex",
  "Premium",
  "Basic",
  "Sport",
  "Outdoor",
] as const;

// CATEGORIES — jenis produk
const CATEGORY_NAMES = [
  "Kaos",
  "Kemeja",
  "Celana Panjang",
  "Celana Pendek",
  "Jaket",
  "Hoodie",
  "Dress",
  "Rok",
  "Cardigan",
  "Polo Shirt",
  "Vest",
  "Sweater",
] as const;

// MODEL names — template: "<adjective> <category> <optional_series>"
const MODEL_ADJECTIVES = [
  "Classic", "Slim Fit", "Regular Fit", "Oversized",
  "Cropped", "Longline", "Relaxed", "Tailored",
  "Vintage", "Modern", "Essential", "Premium",
  "Basic", "Sport", "Casual", "Formal",
] as const;

const MODEL_SERIES = [
  "Series A", "Series B", "Series C",
  "Vol.1", "Vol.2", "Vol.3",
  "2024", "2025", "Edition",
  "", "", "", // lebih banyak tanpa seri
] as const;

// COLORS
const COLORS = [
  "Hitam", "Putih", "Abu-Abu", "Navy", "Biru Tua",
  "Merah", "Maroon", "Hijau Tua", "Olive", "Cokelat",
  "Krem", "Kuning Mustard", "Terracotta", "Dusty Pink",
  "Lavender", "Mint", "Biru Langit", "Coral", "Sage",
  "Charcoal",
] as const;

// SIZES — dikelompokkan per tipe
const SIZES_APPAREL  = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;
const SIZES_CHILDREN = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"] as const;
const SIZES_FREE     = ["Free Size", "S/M", "M/L", "L/XL"] as const;

// STOCK HISTORY descriptions
const HISTORY_IN_DESCS = [
  "Restock dari supplier",
  "Penerimaan barang baru",
  "Transfer dari gudang pusat",
  "Retur dari toko cabang",
  "Tambah stok awal",
  "Pembelian batch bulanan",
  "Top-up stok musiman",
] as const;

const HISTORY_OUT_DESCS = [
  "Penjualan reguler",
  "Pengiriman ke toko cabang",
  "Pengeluaran untuk display toko",
  "Penyesuaian stok opname",
  "Retur ke supplier",
  "Transfer antar gudang",
  "Pengiriman pesanan online",
] as const;

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting inventory database seeder...\n");

  // ════════════════════════════════════════════════════════════════════════════
  // 1. GROUPS (8 grup)
  // ════════════════════════════════════════════════════════════════════════════
  console.log("🗂️  Seeding groups...");

  type CreatedGroup = Awaited<ReturnType<typeof prisma.group.create>>;
  const groups: CreatedGroup[] = [];

  for (const name of GROUP_NAMES) {
    const group = await prisma.group.create({ data: { name } });
    groups.push(group);
  }

  console.log(`   ✅ ${groups.length} groups`);

  // ════════════════════════════════════════════════════════════════════════════
  // 2. CATEGORIES (12 kategori)
  // ════════════════════════════════════════════════════════════════════════════
  console.log("🏷️  Seeding categories...");

  type CreatedCategory = Awaited<ReturnType<typeof prisma.category.create>>;
  const categories: CreatedCategory[] = [];

  for (const name of CATEGORY_NAMES) {
    const category = await prisma.category.create({ data: { name } });
    categories.push(category);
  }

  console.log(`   ✅ ${categories.length} categories`);

  // ════════════════════════════════════════════════════════════════════════════
  // 3. MODELS (100+ model)
  //    ~9–10 model per kategori × 12 kategori = ±108–120 model
  // ════════════════════════════════════════════════════════════════════════════
  console.log("👕 Seeding models (100+)...");

  type CreatedModel = Awaited<ReturnType<typeof prisma.model.create>>;
  const models: CreatedModel[] = [];

  for (const category of categories) {
    const modelCount = faker.number.int({ min: 9, max: 11 });

    const usedNames = new Set<string>();

    for (let i = 0; i < modelCount; i++) {
      let name: string;
      let attempts = 0;

      // Pastikan nama unik dalam kategori ini
      do {
        const adj    = pick(MODEL_ADJECTIVES);
        const series = pick(MODEL_SERIES);
        name         = `${adj} ${category.name}${series ? " " + series : ""}`.trim();
        attempts++;
      } while (usedNames.has(name) && attempts < 30);

      usedNames.add(name);

      const model = await prisma.model.create({
        data: {
          name,
          groupId:    pick(groups).id,
          categoryId: category.id,
          createdAt:  faker.date.past({ years: 2 }),
        },
      });

      models.push(model);
    }
  }

  console.log(`   ✅ ${models.length} models`);

  // ════════════════════════════════════════════════════════════════════════════
  // 4. VARIANTS (2–5 varian per model)
  //    Setiap varian = kombinasi unik color × size dalam 1 model
  // ════════════════════════════════════════════════════════════════════════════
  console.log("🎨 Seeding variants...");

  type CreatedVariant = Awaited<ReturnType<typeof prisma.variant.create>>;
  const variants: CreatedVariant[] = [];
  let skuCounter = 1;

  for (const model of models) {
    const variantCount = faker.number.int({ min: 2, max: 5 });

    // Pilih size pool berdasarkan nama group
    const groupName = groups.find((g) => g.id === model.groupId)?.name ?? "";
    const sizePool: readonly string[] =
      groupName === "Anak-Anak"
        ? SIZES_CHILDREN
        : groupName === "Unisex" || groupName === "Basic"
        ? SIZES_FREE
        : SIZES_APPAREL;

    const usedCombos = new Set<string>();

    for (let i = 0; i < variantCount; i++) {
      let color: string;
      let size: string;
      let combo: string;
      let attempts = 0;

      do {
        color    = pick(COLORS);
        size     = pick(sizePool);
        combo    = `${color}__${size}`;
        attempts++;
      } while (usedCombos.has(combo) && attempts < 30);

      usedCombos.add(combo);

      // Stok awal acak (ada yang kosong, ada yang besar)
      const initialStock = faker.helpers.weightedArrayElement([
        { weight: 10, value: 0 },
        { weight: 30, value: faker.number.int({ min: 1,  max: 20  }) },
        { weight: 40, value: faker.number.int({ min: 20, max: 100 }) },
        { weight: 20, value: faker.number.int({ min: 100, max: 300 }) },
      ]);

      // Buat prefix SKU dari 3 huruf awal model + group
      const skuPrefix = [
        model.name.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 3),
        groupName.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 2),
        color.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 2),
      ].join("");

      const variant = await prisma.variant.create({
        data: {
          modelId: model.id,
          color,
          size,
          stock:   initialStock,
          sku:     makeSku(skuPrefix, skuCounter++),
        },
      });

      variants.push(variant);
    }
  }

  console.log(`   ✅ ${variants.length} variants`);

  // ════════════════════════════════════════════════════════════════════════════
  // 5. STOCK HISTORIES
  //    Setiap varian punya riwayat stok yang konsisten:
  //    - IN pertama = stok awal (onboarding)
  //    - Beberapa transaksi IN/OUT selanjutnya
  //    - Stok akhir pada Variant.stock harus konsisten
  // ════════════════════════════════════════════════════════════════════════════
  console.log("📋 Seeding stock histories...");

  let historyCount = 0;

  for (const variant of variants) {
    const txDates: Date[] = [];

    // ── Transaksi awal (IN) – stok onboarding ─────────────────────────────
    const onboardDate = faker.date.past({ years: 2 });
    txDates.push(onboardDate);

    await prisma.stockHistory.create({
      data: {
        variantId:   variant.id,
        type:        "IN",
        quantity:    variant.stock,
        description: "Stok awal – onboarding produk",
        createdAt:   onboardDate,
      },
    });
    historyCount++;

    // ── Transaksi selanjutnya (1–5 tx, campuran IN/OUT) ───────────────────
    const additionalTx = faker.number.int({ min: 1, max: 5 });
    let   runningStock = variant.stock;

    for (let t = 0; t < additionalTx; t++) {
      const txDate = faker.date.between({
        from: onboardDate,
        to:   new Date(),
      });

      // Tentukan arah transaksi
      // – kalau stok 0, paksa IN
      // – kalau stok > 50, lebih mungkin OUT
      const forceIn  = runningStock <= 0;
      const biasOut  = runningStock > 50;
      const isIn     = forceIn
        ? true
        : biasOut
        ? Math.random() < 0.35
        : Math.random() < 0.55;

      const type = isIn ? ("IN" as const) : ("OUT" as const);

      // Kuantitas transaksi
      const maxOut = runningStock;
      const qty    = isIn
        ? faker.number.int({ min: 5, max: 100 })
        : faker.number.int({ min: 1, max: Math.max(1, Math.min(maxOut, 50)) });

      runningStock = isIn ? runningStock + qty : runningStock - qty;

      await prisma.stockHistory.create({
        data: {
          variantId:   variant.id,
          type,
          quantity:    qty,
          description: isIn ? pick(HISTORY_IN_DESCS) : pick(HISTORY_OUT_DESCS),
          createdAt:   txDate,
        },
      });
      historyCount++;
    }

    // ── Update Variant.stock ke nilai akhir yang konsisten ────────────────
    if (runningStock !== variant.stock) {
      await prisma.variant.update({
        where: { id: variant.id },
        data:  { stock: Math.max(0, runningStock) },
      });
    }
  }

  console.log(`   ✅ ${historyCount} stock history records`);

  // ════════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════════════════════════
  const totalRows =
    groups.length +
    categories.length +
    models.length +
    variants.length +
    historyCount;

  console.log("\n✨ Seeding complete!\n");
  console.log("   ┌─────────────────────────────────────────┐");
  console.log(`   │  Groups             : ${String(groups.length).padStart(6)}           │`);
  console.log(`   │  Categories         : ${String(categories.length).padStart(6)}           │`);
  console.log(`   │  Models             : ${String(models.length).padStart(6)}           │`);
  console.log(`   │  Variants           : ${String(variants.length).padStart(6)}           │`);
  console.log(`   │  Stock Histories    : ${String(historyCount).padStart(6)}           │`);
  console.log("   ├─────────────────────────────────────────┤");
  console.log(`   │  Total rows         : ${String(totalRows).padStart(6)}           │`);
  console.log("   └─────────────────────────────────────────┘\n");
}

// ─── Run ──────────────────────────────────────────────────────────────────────

main()
  .catch((e) => {
    console.error("❌ Seeder failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });