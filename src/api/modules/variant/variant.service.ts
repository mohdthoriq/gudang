import { VariantRepository } from './variant.repository';
import { ModelRepository } from '../model/model.repository';
import { 
  createVariantSchema, 
  updateVariantSchema, 
  queryVariantSchema, 
  bulkDeleteVariantSchema 
} from './variant.validate';
import { Variant } from '../../../../prisma/generated/client';

export class VariantService {
  static async getVariants(queryParams: unknown) {
    const parsed = queryVariantSchema.parse(queryParams);
    
    const pageNum = Number(parsed.page);
    const limitNum = Number(parsed.limit);
    const skip = (pageNum - 1) * limitNum;
    const modelId = parsed.modelId ? parsed.modelId : undefined;

    const [variants, totalItems] = await VariantRepository.findAndCountAll(
      skip, limitNum, parsed.search, modelId
    );

    return {
      data: variants,
      meta: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum),
      },
    };
  }

  static async getVariantById(id: string): Promise<Variant> {
    const variant = await VariantRepository.findById(id);
    if (!variant) throw new Error('Varian tidak ditemukan');
    return variant;
  }

  static async createVariant(payload: unknown): Promise<Variant> {
    const parsedData = createVariantSchema.parse(payload);
    
    // 1. Validasi eksistensi Model
    const modelExists = await ModelRepository.findById(parsedData.modelId);
    if (!modelExists) throw new Error('Model ID tidak valid atau tidak ditemukan');

    // 2. Validasi SKU Unik (Jika diinputkan)
    if (parsedData.sku) {
      const skuExists = await VariantRepository.findBySku(parsedData.sku);
      if (skuExists) throw new Error(`SKU ${parsedData.sku} sudah digunakan oleh varian lain`);
    }

    return VariantRepository.create(parsedData);
  }

  static async updateVariant(id: string, payload: unknown): Promise<Variant> {
    const parsedData = updateVariantSchema.parse(payload);
    const existingVariant = await this.getVariantById(id);
    
    // Validasi Model baru jika diubah
    if (parsedData.modelId && parsedData.modelId !== existingVariant.modelId) {
      const modelExists = await ModelRepository.findById(parsedData.modelId);
      if (!modelExists) throw new Error('Model ID baru tidak valid atau tidak ditemukan');
    }

    // Validasi SKU baru agar tidak bentrok dengan milik produk lain
    if (parsedData.sku && parsedData.sku !== existingVariant.sku) {
      const skuExists = await VariantRepository.findBySku(parsedData.sku);
      if (skuExists) throw new Error(`SKU ${parsedData.sku} sudah digunakan oleh varian lain`);
    }

    return VariantRepository.update(id, parsedData);
  }

  static async deleteVariant(id: string): Promise<Variant> {
    await this.getVariantById(id);
    return VariantRepository.delete(id);
  }

  static async bulkDeleteVariants(payload: unknown) {
    const { ids } = bulkDeleteVariantSchema.parse(payload);
    const result = await VariantRepository.deleteMany(ids);
    if (result.count === 0) throw new Error('Tidak ada varian yang berhasil dihapus');
    return result;
  }

  static async getVariantSummary() {
    return VariantRepository.getSummary();
  }
}
