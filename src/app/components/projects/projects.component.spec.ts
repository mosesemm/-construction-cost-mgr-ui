import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { ApiService } from '../../services/api.service';
import { of, throwError } from 'rxjs';
import { Project } from '../../models/project.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockProjects: Project[] = [
    { id: 1, name: 'Project A', description: 'Desc A', startDate: '2024-01-01', endDate: '2024-12-31', budget: 100000, status: 'in-progress' },
    { id: 2, name: 'Project B', description: 'Desc B', startDate: '2024-02-01', endDate: '2024-11-30', budget: 200000, status: 'completed' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getProjects', 'deleteProject']);

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent, RouterTestingModule],
      providers: [{ provide: ApiService, useValue: spy }]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiServiceSpy.getProjects.and.returnValue(of(mockProjects));
    apiServiceSpy.deleteProject.and.returnValue(of(undefined));

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    expect(apiServiceSpy.getProjects).toHaveBeenCalled();
    expect(component.projects.length).toBe(2);
  });

  it('should set error message when load fails', () => {
    apiServiceSpy.getProjects.and.returnValue(throwError(() => new Error('Network error')));
    component.loadProjects();
    expect(component.error).toBe('Failed to load projects. Please ensure the API is running.');
  });

  it('should return correct status badge class', () => {
    expect(component.getStatusClass('in-progress')).toBe('badge-primary');
    expect(component.getStatusClass('completed')).toBe('badge-success');
    expect(component.getStatusClass('on-hold')).toBe('badge-warning');
    expect(component.getStatusClass('planned')).toBe('badge-secondary');
  });

  it('should delete a project when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteProject(1);
    expect(apiServiceSpy.deleteProject).toHaveBeenCalledWith(1);
    expect(component.projects.length).toBe(1);
    expect(component.projects[0].id).toBe(2);
  });

  it('should not delete a project when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteProject(1);
    expect(apiServiceSpy.deleteProject).not.toHaveBeenCalled();
  });
});
