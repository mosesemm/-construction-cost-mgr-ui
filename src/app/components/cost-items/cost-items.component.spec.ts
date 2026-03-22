import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { CostItemsComponent } from './cost-items.component';
import { ApiService } from '../../services/api.service';
import { of, throwError } from 'rxjs';
import { CostItem } from '../../models/cost-item.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('CostItemsComponent', () => {
  let component: CostItemsComponent;
  let fixture: ComponentFixture<CostItemsComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockCostItems: CostItem[] = [
    { id: 1, projectId: 1, description: 'Cement', category: 'Materials', quantity: 100, unitCost: 10, totalCost: 1000 },
    { id: 2, projectId: 1, description: 'Labor', category: 'Labor', quantity: 50, unitCost: 20, totalCost: 1000 }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getCostItems', 'deleteCostItem']);

    await TestBed.configureTestingModule({
      imports: [CostItemsComponent, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiServiceSpy.getCostItems.and.returnValue(of(mockCostItems));
    apiServiceSpy.deleteCostItem.and.returnValue(of(undefined));

    fixture = TestBed.createComponent(CostItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cost items on init', () => {
    expect(apiServiceSpy.getCostItems).toHaveBeenCalledWith(1);
    expect(component.costItems.length).toBe(2);
  });

  it('should set projectId from route', () => {
    expect(component.projectId).toBe(1);
  });

  it('should calculate totalCost correctly', () => {
    expect(component.totalCost).toBe(2000);
  });

  it('should set error message when load fails', () => {
    apiServiceSpy.getCostItems.and.returnValue(throwError(() => new Error('Network error')));
    component.loadCostItems();
    expect(component.error).toBe('Failed to load cost items. Please ensure the API is running.');
  });

  it('should delete a cost item when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteCostItem(1);
    expect(apiServiceSpy.deleteCostItem).toHaveBeenCalledWith(1, 1);
    expect(component.costItems.length).toBe(1);
    expect(component.costItems[0].id).toBe(2);
  });

  it('should not delete a cost item when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteCostItem(1);
    expect(apiServiceSpy.deleteCostItem).not.toHaveBeenCalled();
  });
});
