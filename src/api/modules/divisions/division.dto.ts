export interface IDivisionResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count?: {
    classes: number;
  };
  classes?: {
    id: string;
    name: string;
  }[];
}
