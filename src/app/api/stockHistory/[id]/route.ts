import { NextRequest } from 'next/server';
import { StockHistoryService } from '@/api/modules/stockHistory/stock-history.service';
import { apiHandler } from '@/lib/api-wrapper';
import { successResponse } from '@/utils/response';

type RouteParams = { params: Promise<{ id: string }> };

export const GET = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  if (!id) throw new Error('ID tidak valid');

  const history = await StockHistoryService.getHistoryById(id);
  return successResponse('Berhasil mengambil detail riwayat', history, 200);
});
