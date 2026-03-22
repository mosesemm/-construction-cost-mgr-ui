export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
}
