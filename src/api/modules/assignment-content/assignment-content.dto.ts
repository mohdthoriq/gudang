import type { ContentType, GradingStatus } from "../../../generated/index.js";

export interface IAssignmentContentResponse {
  id: string;
  assignmentId: string;
  santriId: string;
  contentType: ContentType;
  fileUrl: string[];
  score: number | null;
  mentorFeedback: string | null;
  status: GradingStatus;
  submittedAt: Date;
  assignment?: {
    title: string;
  };
  santri?: {
    id?: string;
    fullName: string;
    nis?: string | null;
    santriProfile?: any;
  };
}

export interface ISubmissionQuery {
  assignmentId?: string;
}
