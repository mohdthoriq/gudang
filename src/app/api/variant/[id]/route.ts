import { NextRequest } from 'next/server';
import { VariantService } from '@/api/modules/variant/variant.service';
import { apiHandler } from '@/lib/api-wrapper';
import { successResponse } from '@/utils/response';

type RouteParams = { params: Promise<{ id: string }> };

export const GET = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) throw new Error('ID tidak valid');

  const variant = await VariantService.getVariantById(id);
  
  return successResponse('Berhasil mengambil detail varian', variant, 200);
});

export const PUT = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) throw new Error('ID tidak valid');

  const body = await request.json();
  const updatedVariant = await VariantService.updateVariant(id, body);
  
  return successResponse('Varian berhasil diperbarui', updatedVariant, 200);
});

export const DELETE = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) throw new Error('ID tidak valid');

  await VariantService.deleteVariant(id);
  
  return successResponse('Varian berhasil dihapus', null, 200);
});
