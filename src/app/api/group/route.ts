import { NextRequest } from 'next/server';
import { GroupService } from '../../../api/modules/group/group.service';
import { apiHandler } from '@/lib/api-wrapper';
import { successResponse } from '@/utils/response';


export const GET = apiHandler(async (request: NextRequest) => {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10)
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10)
    const search = request.nextUrl.searchParams.get('search') || ''

    const result  = await GroupService.getGroups({
        page,
        limit,
        search
    })
  
  return successResponse('Berhasil mengambil data grup', result, 200);
});

export const POST = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const newGroup = await GroupService.createGroup(body);
  
  return successResponse('Grup berhasil ditambahkan', newGroup, 201);
});

export const DELETE = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const result = await GroupService.bulkDeleteGroups(body);
  
  return successResponse(`Berhasil menghapus ${result.count} grup`, result, 200);
});


export const GET_SUMMARY = apiHandler(async () => {
  const summary = await GroupService.getGroupSummary();
  
  return successResponse('Berhasil mengambil ringkasan grup', summary, 200);
});
