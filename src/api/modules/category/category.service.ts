import { CategoryRepository } from './category.repository';
import { 
  createCategorySchema, 
  updateCategorySchema, 
  queryCategorySchema, 
  bulkDeleteCategorySchema 
} from './category.validate';
import { Category } from '../../../../prisma/generated/client';

export class CategoryService {
  static async getCategories(queryParams: unknown) {
    const parsed = queryCategorySchema.parse(queryParams);
    
    const pageNum = Number(parsed.page);
    const limitNum = Number(parsed.limit);
    const skip = (pageNum - 1) * limitNum;
    
    const [categories, totalItems] = await CategoryRepository.findAndCountAll(
      skip, 
      limitNum, 
      parsed.search
    );

    return {
      data: categories,
      meta: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum),
      },
    };
  }

  static async getCategoryById(id: number): Promise<Category> {
    const category = await CategoryRepository.findById(id);
    if (!category) throw new Error('Kategori tidak ditemukan');
    return category;
  }

  static async createCategory(payload: unknown): Promise<Category> {
    const parsedData = createCategorySchema.parse(payload);
    return CategoryRepository.create(parsedData);
  }

  static async updateCategory(id: number, payload: unknown): Promise<Category> {
    const parsedData = updateCategorySchema.parse(payload);
    await this.getCategoryById(id);
    return CategoryRepository.update(id, parsedData);
  }

  static async deleteCategory(id: number): Promise<Category> {
    await this.getCategoryById(id);
    return CategoryRepository.delete(id);
  }

  static async bulkDeleteCategories(payload: unknown) {
    const { ids } = bulkDeleteCategorySchema.parse(payload);
    const result = await CategoryRepository.deleteMany(ids);
    if (result.count === 0) throw new Error('Tidak ada kategori yang dihapus');
    return result;
  }

  static async getCategorySummary() {
    return CategoryRepository.getSummary();
  }
}
