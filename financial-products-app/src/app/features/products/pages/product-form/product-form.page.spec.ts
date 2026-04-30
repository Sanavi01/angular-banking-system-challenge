import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductFormPage } from './product-form.page';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { ApiError } from '../../../../core/models/api-error.model';

const VALID_PRODUCT: Product = {
  id: 'test-id',
  name: 'Producto de Prueba',
  description: 'Descripción de producto de prueba',
  logo: 'https://example.com/logo.png',
  date_release: '2099-12-31',
  date_revision: '2100-12-31',
};

describe('ProductFormPage', () => {
  let component: ProductFormPage;
  let fixture: ComponentFixture<ProductFormPage>;
  let mockProductService: jest.Mocked<Partial<ProductService>>;
  let mockRoute: { snapshot: { paramMap: { get: jest.Mock } } };

  describe('Create mode (no productId)', () => {
    beforeEach(async () => {
      mockProductService = {
        create: jest.fn().mockReturnValue(of(VALID_PRODUCT)),
        getById: jest.fn(),
        update: jest.fn(),
      };

      mockRoute = { snapshot: { paramMap: { get: jest.fn().mockReturnValue(null) } } };

      await TestBed.configureTestingModule({
        imports: [ProductFormPage, HttpClientTestingModule, RouterTestingModule],
        providers: [
          { provide: ProductService, useValue: mockProductService },
          { provide: ActivatedRoute, useValue: mockRoute },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ProductFormPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have isEditMode = false', () => {
      expect(component.isEditMode).toBe(false);
    });

    it('should not call getById when no productId', () => {
      expect(mockProductService.getById).not.toHaveBeenCalled();
    });

    it('should call ProductService.create on formSubmit', () => {
      component.onFormSubmit(VALID_PRODUCT);
      expect(mockProductService.create).toHaveBeenCalledTimes(1);
      expect(mockProductService.create).toHaveBeenCalledWith(VALID_PRODUCT);
    });

    it('should show error on create failure', () => {
      const apiError: ApiError = { status: 400, message: 'Datos inválidos' };
      mockProductService.create = jest
        .fn()
        .mockReturnValue(throwError(() => apiError));

      component.onFormSubmit(VALID_PRODUCT);
      let error: string | null = null;
      component.error$.subscribe((e) => (error = e));
      expect(error).toBe('Datos inválidos');
    });

    it('should set submitting back to false on error', () => {
      const apiError: ApiError = { status: 400, message: 'Error' };
      mockProductService.create = jest
        .fn()
        .mockReturnValue(throwError(() => apiError));

      component.onFormSubmit(VALID_PRODUCT);
      let submitting: boolean | null = null;
      component.submitting$.subscribe((s) => (submitting = s));
      expect(submitting).toBe(false);
    });

    it('should clear error on form reset', () => {
      component.error$.next('Some error');
      component.onFormReset();
      let error: string | null = null;
      component.error$.subscribe((e) => (error = e));
      expect(error).toBeNull();
    });

    it('should complete destroy$ on destroy', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
    });
  });

  describe('Edit mode (with productId)', () => {
    const EXISTING_PRODUCT: Product = { ...VALID_PRODUCT, id: 'existing-id' };

    beforeEach(async () => {
      mockProductService = {
        getById: jest.fn().mockReturnValue(of(EXISTING_PRODUCT)),
        create: jest.fn(),
        update: jest.fn().mockReturnValue(of(EXISTING_PRODUCT)),
      };

      mockRoute = { snapshot: { paramMap: { get: jest.fn().mockReturnValue('existing-id') } } };

      await TestBed.configureTestingModule({
        imports: [ProductFormPage, HttpClientTestingModule, RouterTestingModule],
        providers: [
          { provide: ProductService, useValue: mockProductService },
          { provide: ActivatedRoute, useValue: mockRoute },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ProductFormPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should have isEditMode = true', () => {
      expect(component.isEditMode).toBe(true);
    });

    it('should call getById on init', () => {
      expect(mockProductService.getById).toHaveBeenCalledWith('existing-id');
    });

    it('should load product into product$', () => {
      let product: Product | null = null;
      component.product$.subscribe((p) => (product = p));
      expect(product).toEqual(EXISTING_PRODUCT);
    });

    it('should show error when getById fails', () => {
      const apiError: ApiError = { status: 404, message: 'No encontrado' };

      // Re-create component with failing getById
      mockProductService.getById = jest
        .fn()
        .mockReturnValue(throwError(() => apiError));

      TestBed.resetTestingModule();

      TestBed.configureTestingModule({
        imports: [ProductFormPage, HttpClientTestingModule, RouterTestingModule],
        providers: [
          { provide: ProductService, useValue: mockProductService },
          { provide: ActivatedRoute, useValue: mockRoute },
        ],
      }).compileComponents();

      const newFixture = TestBed.createComponent(ProductFormPage);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      let error: string | null = null;
      newComponent.error$.subscribe((e) => (error = e));
      expect(error).toBe('No encontrado');
    });

    it('should call ProductService.update on formSubmit', () => {
      component.onFormSubmit(EXISTING_PRODUCT);
      expect(mockProductService.update).toHaveBeenCalledTimes(1);
      expect(mockProductService.update).toHaveBeenCalledWith('existing-id', EXISTING_PRODUCT);
    });

    it('should handle update error', () => {
      const apiError: ApiError = { status: 400, message: 'Error al actualizar' };
      mockProductService.update = jest
        .fn()
        .mockReturnValue(throwError(() => apiError));

      component.onFormSubmit(EXISTING_PRODUCT);

      let error: string | null = null;
      component.error$.subscribe((e) => (error = e));
      expect(error).toBe('Error al actualizar');

      let submitting: boolean | null = null;
      component.submitting$.subscribe((s) => (submitting = s));
      expect(submitting).toBe(false);
    });
  });
});
