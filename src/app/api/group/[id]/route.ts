import { NextRequest } from 'next/server';
import { GroupService } from '../../../../api/modules/group/group.service';
import { apiHandler } from '@/lib/api-wrapper';
import { successResponse } from '@/utils/response';

type RouteParams = { params: Promise<{ id: string }> };

export const GET_BY_ID = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) throw new Error('ID tidak valid');

  const group = await GroupService.getGroupById(id);
  
  return successResponse('Berhasil mengambil detail grup', group, 200);
});

export const PUT = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) throw new Error('ID tidak valid');

  const body = await request.json();
  const updatedGroup = await GroupService.updateGroup(id, body);
  
  return successResponse('Grup berhasil diperbarui', updatedGroup, 200);
});

export const DELETE_BY_ID = apiHandler(async (request: NextRequest, { params }: RouteParams) => {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) throw new Error('ID tidak valid');

  await GroupService.deleteGroup(id);
  
  return successResponse('Grup berhasil dihapus', null, 200);
});