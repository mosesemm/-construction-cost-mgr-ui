import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CostItem } from '../../models/cost-item.model';

@Component({
    selector: 'app-cost-items',
    imports: [CommonModule, RouterLink],
    templateUrl: './cost-items.component.html',
    styleUrl: './cost-items.component.css'
})
export class CostItemsComponent implements OnInit {
  projectId!: number;
  costItems: CostItem[] = [];
  loading = false;
  error: string | null = null;

  get totalCost(): number {
    return this.costItems.reduce((sum, item) => sum + item.totalCost, 0);
  }

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCostItems();
  }

  loadCostItems(): void {
    this.loading = true;
    this.error = null;
    this.apiService.getCostItems(this.projectId).subscribe({
      next: (items) => {
        this.costItems = items;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load cost items. Please ensure the API is running.';
        this.loading = false;
      }
    });
  }

  deleteCostItem(itemId: number): void {
    if (!confirm('Are you sure you want to delete this cost item?')) return;
    this.apiService.deleteCostItem(this.projectId, itemId).subscribe({
      next: () => {
        this.costItems = this.costItems.filter(item => item.id !== itemId);
      },
      error: () => {
        this.error = 'Failed to delete cost item.';
      }
    });
  }
}
