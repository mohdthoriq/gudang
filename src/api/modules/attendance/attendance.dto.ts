import type { AttendanceStatus } from "../../../generated/index.js";

export interface IAttendanceResponse {
  id: string;
  classId: string;
  santriId: string;
  mentorId: string;
  date: Date;
  status: AttendanceStatus;
  notes: string | null;
  imageUrl: string | null;
  createdAt: Date;
  class?: {
    name: string;
  };
  santri?: {
    fullName: string;
    nis?: string | null;
    santriProfile?: any;
  };
  mentor?: {
    fullName: string;
  };
}

export interface IAttendanceQuery {
  classId?: string;
  santriId?: string;
  date?: string;
}
