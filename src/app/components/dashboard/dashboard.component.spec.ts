import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ApiService } from '../../services/api.service';
import { of, throwError } from 'rxjs';
import { Project } from '../../models/project.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockProjects: Project[] = [
    { id: 1, name: 'Project A', description: 'Desc A', startDate: '2024-01-01', endDate: '2024-12-31', budget: 100000, status: 'in-progress' },
    { id: 2, name: 'Project B', description: 'Desc B', startDate: '2024-02-01', endDate: '2024-11-30', budget: 200000, status: 'completed' },
    { id: 3, name: 'Project C', description: 'Desc C', startDate: '2024-03-01', endDate: '2024-10-31', budget: 150000, status: 'planned' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getProjects']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule],
      providers: [{ provide: ApiService, useValue: spy }]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiServiceSpy.getProjects.and.returnValue(of(mockProjects));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    expect(apiServiceSpy.getProjects).toHaveBeenCalled();
    expect(component.projects.length).toBe(3);
  });

  it('should calculate totalBudget correctly', () => {
    expect(component.totalBudget).toBe(450000);
  });

  it('should calculate activeProjects correctly', () => {
    expect(component.activeProjects).toBe(1);
  });

  it('should calculate completedProjects correctly', () => {
    expect(component.completedProjects).toBe(1);
  });

  it('should set error message when API call fails', () => {
    apiServiceSpy.getProjects.and.returnValue(throwError(() => new Error('Network error')));
    component.loadProjects();
    expect(component.error).toBe('Failed to load projects. Please ensure the API is running.');
  });

  it('should display loading state', () => {
    component.loading = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading')?.textContent).toContain('Loading');
  });
});
