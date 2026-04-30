import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
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

  beforeEach(async () => {
    mockProductService = {
      create: jest.fn().mockReturnValue(of(VALID_PRODUCT)),
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormPage, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: ProductService, useValue: mockProductService }],
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
    let submitting = false;
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
