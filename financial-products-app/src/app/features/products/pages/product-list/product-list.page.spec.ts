import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError, Subject } from 'rxjs';
import { ProductListPage } from './product-list.page';
import { ProductService } from '../../../../core/services/product.service';
import { ProductStateService } from '../../services/product-state.service';
import { Product } from '../../../../core/models/product.model';
import { ApiError } from '../../../../core/models/api-error.model';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'trj-crd',
    name: 'Tarjetas de Crédito',
    description: 'Tarjeta de consumo bajo la modalidad de crédito',
    logo: 'https://ui-avatars.com/api/?name=TC&size=64',
    date_release: '2026-06-01',
    date_revision: '2027-06-01',
  },
  {
    id: 'trj-dbt',
    name: 'Tarjetas de Débito',
    description: 'Tarjeta para cuentas corrientes y de ahorro',
    logo: 'https://ui-avatars.com/api/?name=TD&size=64',
    date_release: '2026-05-15',
    date_revision: '2027-05-15',
  },
];

describe('ProductListPage', () => {
  let component: ProductListPage;
  let fixture: ComponentFixture<ProductListPage>;
  let mockProductService: jest.Mocked<Partial<ProductService>>;

  beforeEach(async () => {
    mockProductService = {
      getAll: jest.fn().mockReturnValue(of(MOCK_PRODUCTS)),
    };

    await TestBed.configureTestingModule({
      imports: [ProductListPage, RouterTestingModule],
      providers: [
        ProductStateService,
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListPage);
    component = fixture.componentInstance;
    fixture.autoDetectChanges(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Initialization ---

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call ProductService.getAll on init', () => {
      expect(mockProductService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  // --- Error Handling ---

  describe('Error Handling', () => {
    it('should set error message on service failure', async () => {
      const errorMsg = 'No se puede conectar con el servidor';
      const apiError: ApiError = { status: 0, message: errorMsg };

      mockProductService.getAll = jest
        .fn()
        .mockReturnValue(throwError(() => apiError));

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [ProductListPage, RouterTestingModule],
        providers: [
          ProductStateService,
          { provide: ProductService, useValue: mockProductService },
        ],
      }).compileComponents();

      const newFixture = TestBed.createComponent(ProductListPage);
      newFixture.autoDetectChanges(true);
      const newComponent = newFixture.componentInstance;

      let error: string | null = null;
      newComponent.error$.subscribe((e) => (error = e));

      expect(error).toBe(errorMsg);
    });

    it('should set loading to false after error', async () => {
      const apiError: ApiError = { status: 500, message: 'Server error' };

      mockProductService.getAll = jest
        .fn()
        .mockReturnValue(throwError(() => apiError));

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [ProductListPage, RouterTestingModule],
        providers: [
          ProductStateService,
          { provide: ProductService, useValue: mockProductService },
        ],
      }).compileComponents();

      const newFixture = TestBed.createComponent(ProductListPage);
      newFixture.autoDetectChanges(true);
      const newComponent = newFixture.componentInstance;

      let loading: boolean | null = null;
      newComponent.loading$.subscribe((l) => (loading = l));

      expect(loading).toBe(false);
    });
  });

  // --- Page Layout ---

  describe('Page Layout', () => {
    it('should render search component', () => {
      const searchComponent = fixture.debugElement.query(
        By.css('app-product-search'),
      );
      expect(searchComponent).toBeTruthy();
    });

    it('should render add button', () => {
      const addButton = fixture.debugElement.query(By.css('.btn-add'));
      expect(addButton).toBeTruthy();
      expect(addButton.nativeElement.textContent).toContain('Agregar');
    });

    it('should render top bar with search and add button', () => {
      const topBar = fixture.debugElement.query(By.css('.top-bar'));
      expect(topBar).toBeTruthy();
    });

    it('should render footer with results text', () => {
      const resultsText = fixture.debugElement.query(By.css('.results-text'));
      expect(resultsText).toBeTruthy();
    });

    it('should render page size select', () => {
      const select = fixture.debugElement.query(By.css('select'));
      expect(select).toBeTruthy();
    });
  });

  // --- Cleanup ---

  describe('Cleanup', () => {
    it('should complete destroy$ on destroy', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
