import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  error: string | null = null;

  get totalBudget(): number {
    return this.projects.reduce((sum, p) => sum + p.budget, 0);
  }

  get activeProjects(): number {
    return this.projects.filter(p => p.status === 'in-progress').length;
  }

  get completedProjects(): number {
    return this.projects.filter(p => p.status === 'completed').length;
  }

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;
    this.apiService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load projects. Please ensure the API is running.';
        this.loading = false;
      }
    });
  }
}
