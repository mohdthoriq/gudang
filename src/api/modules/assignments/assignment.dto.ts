import type { SubmissionType } from "../../../generated/index.js";

export interface IAssignmentResponse {
  id: string;
  classId: string;
  mentorId: string;
  title: string;
  description: string | null;
  submissionType: SubmissionType;
  attachmentUrl: string | null;
  due_date: Date;
  createdAt: Date;
  class?: {
    name: string;
  };
  mentor?: {
    fullName: string;
  };
  submissions?: any[];
  _count?: {
    submissions: number;
  };
}
