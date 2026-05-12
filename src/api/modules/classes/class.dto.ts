export interface IClassResponse {
  id: string;
  name: string;
  divisiId: string;
  mentorId: string;
  createdAt: Date;
  division?: {
    name: string;
  };
  mentor?: {
    id?: string;
    fullName: string;
    email?: string;
  };
  _count?: {
    santriProfiles: number;
    assignments?: number;
    attendances?: number;
  };
}
