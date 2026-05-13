import { ModelRepository } from './model.repository';
import { GroupRepository } from '../group/group.repository';
import { 
  createModelSchema, 
  updateModelSchema, 
  queryModelSchema,
  bulkDeleteModelSchema 
} from './model.validate';
import { Model } from '../../../../prisma/generated/client';

export class ModelService {
  static async getModels(queryParams: unknown) {
    const parsed = queryModelSchema.parse(queryParams);
    
    const pageNum = Number(parsed.page);
    const limitNum = Number(parsed.limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Tarik nilai opsional
    const search = parsed.search;
    const groupId = parsed.groupId ? String(parsed.groupId) : undefined;

    const [models, totalItems] = await ModelRepository.findAndCountAll(
      skip, 
      limitNum, 
      search, 
      groupId
    );

    return {
      data: models,
      meta: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum),
      },
    };
  }

  static async getModelById(id: string): Promise<Model> {
    const model = await ModelRepository.findById(id);
    if (!model) throw new Error('Model tidak ditemukan');
    return model;
  }

  static async createModel(payload: unknown): Promise<Model> {
    const parsedData = createModelSchema.parse(payload);
    
    // Validasi apakah Group-nya benar-benar ada di database
    const groupExists = await GroupRepository.findById(parsedData.groupId);
    if (!groupExists) throw new Error('Group ID tidak valid atau tidak ditemukan');

    return ModelRepository.create(parsedData);
  }

  static async updateModel(id: string, payload: unknown): Promise<Model> {
    const parsedData = updateModelSchema.parse(payload);
    await this.getModelById(id); // Pastikan model ada sebelum di-update
    
    // Jika user mengupdate groupId, pastikan group barunya ada
    if (parsedData.groupId) {
      const groupExists = await GroupRepository.findById(parsedData.groupId);
      if (!groupExists) throw new Error('Group ID baru tidak valid atau tidak ditemukan');
    }

    return ModelRepository.update(id, parsedData);
  }

  static async deleteModel(id: string): Promise<Model> {
    await this.getModelById(id);
    return ModelRepository.delete(id);
  }

  static async bulkDeleteModels(payload: unknown) {
    const { ids } = bulkDeleteModelSchema.parse(payload);
    const result = await ModelRepository.deleteMany(ids);
    if (result.count === 0) throw new Error('Tidak ada model yang berhasil dihapus');
    return result;
  }

  static async getModelSummary() {
    return ModelRepository.getSummary();
  }
}