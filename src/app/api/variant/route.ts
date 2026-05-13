import { NextRequest } from 'next/server';
import { VariantService } from '@/api/modules/variant/variant.service';
import { apiHandler } from '@/lib/api-wrapper';
import { successResponse } from '@/utils/response';

export const GET = apiHandler(async (request: NextRequest) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = await VariantService.getVariants(searchParams);
  
  return successResponse('Berhasil mengambil data varian', result, 200);
});

export const POST = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const newVariant = await VariantService.createVariant(body);
  
  return successResponse('Varian berhasil ditambahkan', newVariant, 201);
});

export const DELETE = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const result = await VariantService.bulkDeleteVariants(body);
  
  return successResponse(`Berhasil menghapus ${result.count} varian`, result, 200);
});

export const GET_SUMMARY = apiHandler(async () => {
  const summary = await VariantService.getVariantSummary();
  
  return successResponse('Berhasil mengambil ringkasan varian', summary, 200);
});
