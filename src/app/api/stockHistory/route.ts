import { NextRequest } from 'next/server';
import { StockHistoryService } from '@/api/modules/stockHistory/stock-history.service';
import { apiHandler } from '@/lib/api-wrapper';
import { successResponse } from '@/utils/response';

export const GET = apiHandler(async (request: NextRequest) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = await StockHistoryService.getHistories(searchParams);
  return successResponse('Berhasil mengambil riwayat stok', result, 200);
});

export const POST = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const newHistory = await StockHistoryService.createHistory(body);
  return successResponse('Transaksi stok berhasil dicatat', newHistory, 201);
});
