import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProductPaginationComponent } from './product-pagination.component';

const TID = (id: string) => `[data-testid="${id}"]`;

describe('ProductPaginationComponent', () => {
  let component: ProductPaginationComponent;
  let fixture: ComponentFixture<ProductPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPaginationComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductPaginationComponent);
    component = fixture.componentInstance;
  });

  describe('Result count', () => {
    it('should display correct result count', () => {
      component.totalItems = 5;
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css(TID('results-text')));
      expect(el.nativeElement.textContent.trim()).toBe('5 resultados');
    });

    it('should display "1 resultado" when total is 1', () => {
      component.totalItems = 1;
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css(TID('results-text')));
      expect(el.nativeElement.textContent.trim()).toBe('1 resultado');
    });
  });

  describe('Select options', () => {
    it('should render select with options 5, 10, 20', () => {
      component.totalItems = 10;
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css(TID('page-size-select')));
      expect(select).toBeTruthy();
      const options = select.queryAll(By.css('option'));
      const values = options.map((o) => Number(o.nativeElement.value));
      expect(values).toContain(5);
      expect(values).toContain(10);
      expect(values).toContain(20);
    });
  });

  describe('Page size change', () => {
    it('should emit pageSizeChange when select changes to 10', () => {
      const emitSpy = jest.spyOn(component.pageSizeChange, 'emit');
      component.onPageSizeSelect(10);
      expect(emitSpy).toHaveBeenCalledWith(10);
    });
  });

  describe('Navigation buttons', () => {
    it('should disable prev button on first page', () => {
      component.currentPage = 1;
      component.totalPages = 3;
      fixture.detectChanges();
      const prevBtn = fixture.debugElement.query(By.css(TID('btn-prev')));
      expect(prevBtn.nativeElement.disabled).toBe(true);
    });

    it('should disable next button on last page', () => {
      component.currentPage = 3;
      component.totalPages = 3;
      fixture.detectChanges();
      const nextBtn = fixture.debugElement.query(By.css(TID('btn-next')));
      expect(nextBtn.nativeElement.disabled).toBe(true);
    });

    it('should enable both on middle page', () => {
      component.currentPage = 2;
      component.totalPages = 3;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(TID('btn-prev'))).nativeElement.disabled).toBe(false);
      expect(fixture.debugElement.query(By.css(TID('btn-next'))).nativeElement.disabled).toBe(false);
    });
  });

  describe('Page indicator', () => {
    it('should display current page indicator', () => {
      component.currentPage = 2;
      component.totalPages = 5;
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css(TID('page-indicator')));
      expect(el.nativeElement.textContent.trim()).toBe('Página 2 de 5');
    });
  });

  describe('Navigation events', () => {
    it('should emit pageChange on goToPrevious', () => {
      component.currentPage = 3;
      const emitSpy = jest.spyOn(component.pageChange, 'emit');
      component.goToPrevious();
      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('should emit pageChange on goToNext', () => {
      component.currentPage = 1;
      component.totalPages = 3;
      const emitSpy = jest.spyOn(component.pageChange, 'emit');
      component.goToNext();
      expect(emitSpy).toHaveBeenCalledWith(2);
    });
  });

  describe('Getters', () => {
    it('should return correct isFirstPage and isLastPage', () => {
      component.currentPage = 1;
      component.totalPages = 1;
      expect(component.isFirstPage).toBe(true);
      expect(component.isLastPage).toBe(true);

      component.currentPage = 2;
      component.totalPages = 3;
      expect(component.isFirstPage).toBe(false);
      expect(component.isLastPage).toBe(false);
    });
  });
});
