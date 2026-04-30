import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductSearchComponent } from './product-search.component';

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

  // --- Rendering ---

  describe('Rendering', () => {
    it('should render search input with placeholder', () => {
      const input = fixture.debugElement.query(By.css('input'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.placeholder).toBe('Search...');
    });

    it('should render search wrapper container', () => {
      const wrapper = fixture.debugElement.query(By.css('.search-wrapper'));
      expect(wrapper).toBeTruthy();
    });

    it('should start with empty input value', () => {
      expect(component.searchControl.value).toBe('');
    });
  });

  // --- Debounce and Emission ---

  describe('Search emission', () => {
    it('should emit search term after debounce of 300ms', fakeAsync(() => {
      const emitSpy = jest.spyOn(component.searchChange, 'emit');

      component.searchControl.setValue('tarjeta');
      tick(100); // Antes del debounce
      expect(emitSpy).not.toHaveBeenCalled();

      tick(200); // Completa 300ms
      expect(emitSpy).toHaveBeenCalledWith('tarjeta');
    }));

    it('should not emit while user is still typing (debounce reset)', fakeAsync(() => {
      const emitSpy = jest.spyOn(component.searchChange, 'emit');

      component.searchControl.setValue('t');
      tick(200);
      component.searchControl.setValue('ta');
      tick(200);
      component.searchControl.setValue('tar');
      tick(200);
      // Still not emitted (debounce resets on each keystroke)
      expect(emitSpy).not.toHaveBeenCalled();

      tick(300); // Final debounce after last keystroke
      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith('tar');
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

      // Set same value again — should not emit via distinctUntilChanged
      component.searchControl.setValue('tarjeta');
      tick(300);
      expect(emitSpy).toHaveBeenCalledTimes(1);
    }));

    it('should emit empty string when input is cleared', fakeAsync(() => {
      const emitSpy = jest.spyOn(component.searchChange, 'emit');

      // Type something first
      component.searchControl.setValue('tarjeta');
      tick(300);
      expect(emitSpy).toHaveBeenCalledWith('tarjeta');

      // Clear
      component.searchControl.setValue('');
      tick(300);
      expect(emitSpy).toHaveBeenCalledWith('');
    }));

    it('should emit different values on consecutive changes', fakeAsync(() => {
      const emitSpy = jest.spyOn(component.searchChange, 'emit');

      component.searchControl.setValue('tarjeta');
      tick(300);
      expect(emitSpy).toHaveBeenCalledWith('tarjeta');

      component.searchControl.setValue('cuenta');
      tick(300);
      expect(emitSpy).toHaveBeenCalledWith('cuenta');

      expect(emitSpy).toHaveBeenCalledTimes(2);
    }));
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
