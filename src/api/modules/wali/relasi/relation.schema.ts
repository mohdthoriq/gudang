import { z } from "zod";
import { WaliSantriCategory } from "../../../../generated/index.js"; // Sesuaikan path Prisma client kamu

export const createWaliRelationSchema = z.object({
  waliId: z.string().uuid("Format Wali ID tidak valid"),
  santriId: z.string().uuid("Format Santri ID tidak valid"),
  category: z.nativeEnum(WaliSantriCategory, {
    message: "Kategori hubungan tidak valid" 
  }).default(WaliSantriCategory.OTHER),
});

export const updateWaliRelationSchema = z.object({
  category: z.nativeEnum(WaliSantriCategory),
});

export type ICreateWaliRelation = z.infer<typeof createWaliRelationSchema>;
export type IUpdateWaliRelation = z.infer<typeof updateWaliRelationSchema>;
