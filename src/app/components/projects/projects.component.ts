import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';

@Component({
    selector: 'app-projects',
    imports: [CommonModule, RouterLink],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  error: string | null = null;

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
      error: () => {
        this.error = 'Failed to load projects. Please ensure the API is running.';
        this.loading = false;
      }
    });
  }

  deleteProject(id: number): void {
    if (!confirm('Are you sure you want to delete this project?')) return;
    this.apiService.deleteProject(id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== id);
      },
      error: () => {
        this.error = 'Failed to delete project.';
      }
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'planned': 'badge-secondary',
      'in-progress': 'badge-primary',
      'completed': 'badge-success',
      'on-hold': 'badge-warning'
    };
    return classes[status] ?? 'badge-secondary';
  }
}
