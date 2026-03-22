import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Project } from '../models/project.model';
import { CostItem } from '../models/cost-item.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all projects', () => {
    const mockProjects: Project[] = [
      { id: 1, name: 'Project A', description: 'Desc A', startDate: '2024-01-01', endDate: '2024-12-31', budget: 100000, status: 'in-progress' }
    ];

    service.getProjects().subscribe(projects => {
      expect(projects.length).toBe(1);
      expect(projects[0].name).toBe('Project A');
    });

    const req = httpMock.expectOne(`${baseUrl}/projects`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });

  it('should fetch a single project', () => {
    const mockProject: Project = { id: 1, name: 'Project A', description: 'Desc A', startDate: '2024-01-01', endDate: '2024-12-31', budget: 100000, status: 'in-progress' };

    service.getProject(1).subscribe(project => {
      expect(project.id).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/projects/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProject);
  });

  it('should create a project', () => {
    const newProject = { name: 'New Project', description: 'New Desc', startDate: '2024-01-01', endDate: '2024-12-31', budget: 50000, status: 'planned' as const };
    const createdProject: Project = { id: 2, ...newProject };

    service.createProject(newProject).subscribe(project => {
      expect(project.id).toBe(2);
      expect(project.name).toBe('New Project');
    });

    const req = httpMock.expectOne(`${baseUrl}/projects`);
    expect(req.request.method).toBe('POST');
    req.flush(createdProject);
  });

  it('should delete a project', () => {
    service.deleteProject(1).subscribe(response => {
      expect(response).toBeFalsy();
    });

    const req = httpMock.expectOne(`${baseUrl}/projects/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch cost items for a project', () => {
    const mockItems: CostItem[] = [
      { id: 1, projectId: 1, description: 'Cement', category: 'Materials', quantity: 100, unitCost: 10, totalCost: 1000 }
    ];

    service.getCostItems(1).subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].description).toBe('Cement');
    });

    const req = httpMock.expectOne(`${baseUrl}/projects/1/cost-items`);
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });
});
