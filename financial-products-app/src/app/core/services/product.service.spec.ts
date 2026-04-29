import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

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

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // getAll

  it('should fetch all products successfully', () => {
    service.getAll().subscribe((products) => {
      expect(products).toEqual(MOCK_PRODUCTS);
      expect(products.length).toBe(2);
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush({ data: MOCK_PRODUCTS });
  });

  it('should return empty array when backend returns empty data', () => {
    service.getAll().subscribe((products) => {
      expect(products).toEqual([]);
      expect(products.length).toBe(0);
    });

    const req = httpMock.expectOne('/bp/products');
    req.flush({ data: [] });
  });

  it('should handle HTTP 500 error', () => {
    service.getAll().subscribe({
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/bp/products');
    req.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  it('should handle HTTP 404 error', () => {
    service.getById('nonexistent').subscribe({
      error: (err) => {
        expect(err.status).toBe(404);
      },
    });

    const req = httpMock.expectOne('/bp/products/nonexistent');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  // getById

  it('should fetch a product by id successfully', () => {
    const product = MOCK_PRODUCTS[0];

    service.getById('trj-crd').subscribe((result) => {
      expect(result).toEqual(product);
      expect(result.id).toBe('trj-crd');
    });

    const req = httpMock.expectOne('/bp/products/trj-crd');
    expect(req.request.method).toBe('GET');
    req.flush(product);
  });

  // create

  it('should create a product successfully', () => {
    const newProduct: Product = {
      id: 'test-new',
      name: 'Nuevo Producto',
      description: 'Descripción de prueba para nuevo producto',
      logo: 'https://example.com/logo.png',
      date_release: '2026-08-01',
      date_revision: '2027-08-01',
    };

    service.create(newProduct).subscribe((result) => {
      expect(result).toEqual(newProduct);
      expect(result.id).toBe('test-new');
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush({
      message: 'Product added successfully',
      data: newProduct,
    });
  });

  it('should handle 400 error on create (duplicate id)', () => {
    service.create(MOCK_PRODUCTS[0]).subscribe({
      error: (err) => {
        expect(err.status).toBe(400);
      },
    });

    const req = httpMock.expectOne('/bp/products');
    req.flush(
      { message: 'Duplicate identifier found in the database' },
      { status: 400, statusText: 'Bad Request' },
    );
  });

  // update

  it('should update a product successfully', () => {
    const updateData: Partial<Product> = {
      name: 'Nombre Actualizado',
    };

    service.update('trj-crd', updateData).subscribe((result) => {
      expect(result.name).toBe('Nombre Actualizado');
    });

    const req = httpMock.expectOne('/bp/products/trj-crd');
    expect(req.request.method).toBe('PUT');
    req.flush({
      message: 'Product updated successfully',
      data: { ...MOCK_PRODUCTS[0], ...updateData },
    });
  });

  // delete

  it('should delete a product successfully', () => {
    service.delete('trj-crd').subscribe((result) => {
      expect(result).toBeUndefined();
    });

    const req = httpMock.expectOne('/bp/products/trj-crd');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Product removed successfully' });
  });

  // verifyId

  it('should verify that an id exists', () => {
    service.verifyId('trj-crd').subscribe((exists) => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne('/bp/products/verification/trj-crd');
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should verify that an id does not exist', () => {
    service.verifyId('nonexistent').subscribe((exists) => {
      expect(exists).toBe(false);
    });

    const req = httpMock.expectOne('/bp/products/verification/nonexistent');
    req.flush(false);
  });
});
