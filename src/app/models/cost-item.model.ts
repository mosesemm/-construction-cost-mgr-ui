export interface CostItem {
  id: number;
  projectId: number;
  description: string;
  category: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}
