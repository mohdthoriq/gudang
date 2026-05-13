import { NextRequest } from 'next/server';
import { ModelService } from '@/api/modules/model/model.service';
import { apiHandler } from '@/lib/api-wrapper';
import { successResponse } from '@/utils/response';

type RouteParams = { params: Promise<{ id: string }> };

export const GET_BY_ID = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) throw new Error('ID tidak valid');

  const model = await ModelService.getModelById(id);
  return successResponse('Berhasil mengambil detail model', model, 200);
});

export const PUT_BY_ID = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) throw new Error('ID tidak valid');

  const body = await request.json();
  const updatedModel = await ModelService.updateModel(id, body);
  return successResponse('Model berhasil diperbarui', updatedModel, 200);
});

export const DELETE_BY_ID = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) throw new Error('ID tidak valid');

  await ModelService.deleteModel(id);
  return successResponse('Model berhasil dihapus', null, 200);
});
