import { GroupRepository } from './group.repository';
import { 
  createGroupSchema, 
  updateGroupSchema, 
  queryGroupSchema, 
  bulkDeleteGroupSchema, 
  QueryGroupDTO
} from './group.validate';
import { Group } from '../../../../prisma/generated/client';

export class GroupService {
  static async getGroups(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params
    const skip = (page - 1) * limit
    const [groups, totalItems] = await GroupRepository.findAndCountAll(skip, limit, search)

    return {
      data: groups,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  static async getGroupById(id: number): Promise<Group> {
    const group = await GroupRepository.findById(id);
    if (!group) throw new Error('Grup tidak ditemukan');
    return group;
  }

  static async createGroup(payload: unknown): Promise<Group> {
    const parsedData = createGroupSchema.parse(payload);
    return GroupRepository.create(parsedData);
  }

  static async updateGroup(id: number, payload: unknown): Promise<Group> {
    const parsedData = updateGroupSchema.parse(payload);
    await this.getGroupById(id); // Validasi eksistensi sebelum update
    return GroupRepository.update(id, parsedData);
  }

  static async deleteGroup(id: number): Promise<Group> {
    await this.getGroupById(id); // Validasi eksistensi sebelum delete
    return GroupRepository.delete(id);
  }

  static async bulkDeleteGroups(payload: unknown) {
    const { ids } = bulkDeleteGroupSchema.parse(payload);
    const result = await GroupRepository.deleteMany(ids);
    if (result.count === 0) throw new Error('Tidak ada grup yang berhasil dihapus');
    return result;
  }

  static async getGroupSummary() {
    return GroupRepository.getSummary();
  }
}