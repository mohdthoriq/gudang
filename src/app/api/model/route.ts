import { NextRequest } from 'next/server';
import { ModelService } from '@/api/modules/model/model.service';
import { apiHandler } from '@/lib/api-wrapper';
import { successResponse } from '@/utils/response';

export const GET = apiHandler(async (request: NextRequest) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = await ModelService.getModels(searchParams);
  
  return successResponse('Berhasil mengambil data model', result, 200);
});

export const POST = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const newModel = await ModelService.createModel(body);
  
  return successResponse('Model berhasil ditambahkan', newModel, 201);
});

export const DELETE = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const result = await ModelService.bulkDeleteModels(body);
  
  return successResponse(`Berhasil menghapus ${result.count} model`, result, 200);
});

export const GET_SUMMARY = apiHandler(async () => {
  const summary = await ModelService.getModelSummary();
  return successResponse('Berhasil mengambil ringkasan model', summary, 200);
});