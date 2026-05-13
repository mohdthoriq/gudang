import { NextRequest } from 'next/server';
import { CategoryService } from '../../../api/modules/category/category.service';
import { apiHandler } from '@/lib/api-wrapper';
import { successResponse } from '@/utils/response';

export const GET = apiHandler(async (request: NextRequest) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = await CategoryService.getCategories(searchParams);
  return successResponse('Berhasil mengambil data kategori', result, 200);
});

export const POST = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const newCategory = await CategoryService.createCategory(body);
  return successResponse('Kategori berhasil ditambahkan', newCategory, 201);
});

export const DELETE = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const result = await CategoryService.bulkDeleteCategories(body);
  return successResponse(`Berhasil menghapus ${result.count} kategori`, result, 200);
});

export const GET_SUMMARY = apiHandler(async () => {
  const summary = await CategoryService.getCategorySummary();
  return successResponse('Berhasil mengambil ringkasan kategori', summary, 200);
});
