import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductSearchComponent } from './product-search.component';

const TID = (id: string) => `[data-testid="${id}"]`;

describe('ProductSearchComponent', () => {
  let component: ProductSearchComponent;
  let fixture: ComponentFixture<ProductSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSearchComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render search input with placeholder', () => {
      const input = fixture.debugElement.query(By.css(TID('search-input')));
      expect(input).toBeTruthy();
      expect(input.nativeElement.placeholder).toBe('Search...');
    });

    it('should start with empty input value', () => {
      expect(component.searchControl.value).toBe('');
    });
  });

  describe('Search emission', () => {
    it('should emit search term after debounce of 300ms', fakeAsync(() => {
      const emitSpy = jest.spyOn(component.searchChange, 'emit');
      component.searchControl.setValue('tarjeta');
      tick(100);
      expect(emitSpy).not.toHaveBeenCalled();
      tick(200);
      expect(emitSpy).toHaveBeenCalledWith('tarjeta');
    }));

    it('should trim search term before emitting', fakeAsync(() => {
      const emitSpy = jest.spyOn(component.searchChange, 'emit');
      component.searchControl.setValue('  crédito  ');
      tick(300);
      expect(emitSpy).toHaveBeenCalledWith('crédito');
    }));

    it('should not emit duplicate consecutive terms', fakeAsync(() => {
      const emitSpy = jest.spyOn(component.searchChange, 'emit');
      component.searchControl.setValue('tarjeta');
      tick(300);
      expect(emitSpy).toHaveBeenCalledTimes(1);
      component.searchControl.setValue('tarjeta');
      tick(300);
      expect(emitSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Cleanup', () => {
    it('should complete destroy$ on destroy', () => {
      const nextSpy = jest.spyOn(component['destroy$'], 'next');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
    });
  });
});
