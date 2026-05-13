import { NextRequest } from 'next/server';
import { CategoryService } from '@/api/modules/category/category.service';
import { apiHandler } from '@/lib/api-wrapper';
import { successResponse } from '@/utils/response';

type RouteParams = { params: Promise<{ id: string }> };

export const GET_BY_ID = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const { id } = await params;
  const category = await CategoryService.getCategoryById(Number(id));
  return successResponse('Berhasil mengambil detail kategori', category, 200);
});

export const PUT_BY_ID = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const { id } = await params;
  const body = await request.json();
  const updated = await CategoryService.updateCategory(Number(id), body);
  return successResponse('Kategori berhasil diperbarui', updated, 200);
});

export const DELETE_BY_ID = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const { id } = await params;
  await CategoryService.deleteCategory(Number(id));
  return successResponse('Kategori berhasil dihapus', null, 200);
});