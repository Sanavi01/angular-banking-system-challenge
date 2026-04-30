import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { IdExistsValidator } from './id-exists.validator';
import { ProductService } from '../../core/services/product.service';

describe('IdExistsValidator', () => {
  let validator: IdExistsValidator;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService, IdExistsValidator],
    });
    validator = TestBed.inject(IdExistsValidator);
    productService = TestBed.inject(ProductService);
  });

  it('should return null when id does not exist', (done) => {
    jest.spyOn(productService, 'verifyId').mockReturnValue(of(false));
    const control = new FormControl('new-id');

    const result$ = validator.validate(control);
    result$.subscribe((errors) => {
      expect(errors).toBeNull();
      done();
    });
  });

  it('should return idExists error when id exists', (done) => {
    jest.spyOn(productService, 'verifyId').mockReturnValue(of(true));
    const control = new FormControl('trj-crd');

    const result$ = validator.validate(control);
    result$.subscribe((errors) => {
      expect(errors).toEqual({ idExists: true });
      done();
    });
  });

  it('should return null when id is less than 3 characters', (done) => {
    const control = new FormControl('ab');

    const result$ = validator.validate(control);
    result$.subscribe((errors) => {
      expect(errors).toBeNull();
      done();
    });
  });

  it('should return null when value is empty', (done) => {
    const control = new FormControl('');

    const result$ = validator.validate(control);
    result$.subscribe((errors) => {
      expect(errors).toBeNull();
      done();
    });
  });
});
