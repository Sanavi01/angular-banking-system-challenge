import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ProductListPage } from './product-list.page';
import { ProductService } from '../../../../core/services/product.service';
import { ProductStateService } from '../../services/product-state.service';
import { Product } from '../../../../core/models/product.model';
import { ApiError } from '../../../../core/models/api-error.model';

const MOCK_PRODUCTS: Product[] = [
  { id: 'trj-crd', name: 'Tarjetas de Crédito', description: 'Tarjeta de consumo bajo la modalidad de crédito', logo: 'https://ui-avatars.com/api/?name=TC&size=64', date_release: '2026-06-01', date_revision: '2027-06-01' },
  { id: 'trj-dbt', name: 'Tarjetas de Débito', description: 'Tarjeta para cuentas corrientes y de ahorro', logo: 'https://ui-avatars.com/api/?name=TD&size=64', date_release: '2026-05-15', date_revision: '2027-05-15' },
];

const TID = (id: string) => `[data-testid="${id}"]`;

describe('ProductListPage', () => {
  let component: ProductListPage;
  let fixture: ComponentFixture<ProductListPage>;
  let mockProductService: jest.Mocked<Partial<ProductService>>;

  beforeEach(async () => {
    mockProductService = { getAll: jest.fn().mockReturnValue(of(MOCK_PRODUCTS)) };
    await TestBed.configureTestingModule({
      imports: [ProductListPage, RouterTestingModule],
      providers: [ProductStateService, { provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListPage);
    component = fixture.componentInstance;
    fixture.autoDetectChanges(true);
  });

  afterEach(() => jest.clearAllMocks());

  describe('Initialization', () => {
    it('should create', () => expect(component).toBeTruthy());
    it('should call ProductService.getAll on init', () => {
      expect(mockProductService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should set error on service failure', async () => {
      const apiError: ApiError = { status: 0, message: 'Error conexión' };
      mockProductService.getAll = jest.fn().mockReturnValue(throwError(() => apiError));
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [ProductListPage, RouterTestingModule],
        providers: [ProductStateService, { provide: ProductService, useValue: mockProductService }],
      }).compileComponents();
      const f = TestBed.createComponent(ProductListPage);
      f.autoDetectChanges(true);
      let error: string | null = null;
      f.componentInstance.error$.subscribe((e) => (error = e));
      expect(error).toBe('Error conexión');
    });
  });

  describe('Page Layout', () => {
    it('should render top bar', () => {
      const topBar = fixture.debugElement.query(By.css(TID('top-bar')));
      expect(topBar).toBeTruthy();
    });

    it('should render search component', () => {
      const search = fixture.debugElement.query(By.css('app-product-search'));
      expect(search).toBeTruthy();
    });

    it('should render add button', () => {
      const btn = fixture.debugElement.query(By.css(TID('btn-add')));
      expect(btn).toBeTruthy();
      expect(btn.nativeElement.textContent).toContain('Agregar');
    });

    it('should render results text', () => {
      const el = fixture.debugElement.query(By.css(TID('results-text')));
      expect(el).toBeTruthy();
    });

    it('should render page size select', () => {
      const select = fixture.debugElement.query(By.css(TID('page-size-select')));
      expect(select).toBeTruthy();
    });
  });

  describe('Cleanup', () => {
    it('should complete destroy$ on destroy', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
    });
  });
});
