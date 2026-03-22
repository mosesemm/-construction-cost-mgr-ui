import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { CostItem } from '../models/cost-item.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`);
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}`);
  }

  getCostItems(projectId: number): Observable<CostItem[]> {
    return this.http.get<CostItem[]>(`${this.baseUrl}/projects/${projectId}/cost-items`);
  }

  createCostItem(projectId: number, item: Omit<CostItem, 'id' | 'projectId'>): Observable<CostItem> {
    return this.http.post<CostItem>(`${this.baseUrl}/projects/${projectId}/cost-items`, item);
  }

  deleteCostItem(projectId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}/cost-items/${itemId}`);
  }
}
