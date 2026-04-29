import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProductPaginationComponent } from './product-pagination.component';

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

  // --- Result Count ---

  describe('Result count', () => {
    it('should display correct result count', () => {
      component.totalItems = 5;
      fixture.detectChanges();

      const resultsText = fixture.debugElement.query(By.css('.results-text'));
      expect(resultsText.nativeElement.textContent.trim()).toBe('5 resultados');
    });

    it('should display "1 resultado" when total is 1 (singular)', () => {
      component.totalItems = 1;
      fixture.detectChanges();

      const resultsText = fixture.debugElement.query(By.css('.results-text'));
      expect(resultsText.nativeElement.textContent.trim()).toBe('1 resultado');
    });

    it('should display "0 resultados" when total is 0', () => {
      component.totalItems = 0;
      fixture.detectChanges();

      const resultsText = fixture.debugElement.query(By.css('.results-text'));
      expect(resultsText.nativeElement.textContent.trim()).toBe('0 resultados');
    });
  });

  // --- Select Options ---

  describe('Select options', () => {
    it('should render select with options 5, 10, 20', () => {
      component.totalItems = 10;
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('select'));
      expect(select).toBeTruthy();

      const options = fixture.debugElement.queryAll(
        By.css('select option:not([value=""])'),
      );
      const values = options.map((o) => Number(o.nativeElement.value));

      expect(values).toContain(5);
      expect(values).toContain(10);
      expect(values).toContain(20);
      expect(options.length).toBe(3);
    });

    it('should show select is rendered', () => {
      component.totalItems = 10;
      fixture.detectChanges();

      const select = fixture.debugElement.query(By.css('select'));
      expect(select).toBeTruthy();
    });
  });

  // --- Page Size Change Emission ---

  describe('Page size change', () => {
    it('should emit pageSizeChange when select changes to 10', () => {
      const emitSpy = jest.spyOn(component.pageSizeChange, 'emit');

      component.onPageSizeSelect(10);

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(10);
    });

    it('should emit pageSizeChange when select changes to 20', () => {
      const emitSpy = jest.spyOn(component.pageSizeChange, 'emit');

      component.onPageSizeSelect(20);

      expect(emitSpy).toHaveBeenCalledWith(20);
    });
  });

  // --- Navigation Buttons ---

  describe('Navigation buttons', () => {
    it('should disable prev button on first page', () => {
      component.currentPage = 1;
      component.totalPages = 3;
      fixture.detectChanges();

      const prevBtn = fixture.debugElement.queryAll(By.css('.nav-btn'))[0];
      expect(prevBtn.nativeElement.disabled).toBe(true);
    });

    it('should disable next button on last page', () => {
      component.currentPage = 3;
      component.totalPages = 3;
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('.nav-btn'));
      const nextBtn = buttons[1]; // Siguiente is the second button
      expect(nextBtn.nativeElement.disabled).toBe(true);
    });

    it('should enable both buttons on middle page', () => {
      component.currentPage = 2;
      component.totalPages = 3;
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('.nav-btn'));
      expect(buttons[0].nativeElement.disabled).toBe(false);
      expect(buttons[1].nativeElement.disabled).toBe(false);
    });

    it('should disable both buttons when only 1 page', () => {
      component.currentPage = 1;
      component.totalPages = 1;
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('.nav-btn'));
      expect(buttons[0].nativeElement.disabled).toBe(true);
      expect(buttons[1].nativeElement.disabled).toBe(true);
    });
  });

  // --- Page Indicator ---

  describe('Page indicator', () => {
    it('should display current page indicator', () => {
      component.currentPage = 2;
      component.totalPages = 5;
      fixture.detectChanges();

      const indicator = fixture.debugElement.query(By.css('.page-indicator'));
      expect(indicator.nativeElement.textContent.trim()).toBe(
        'Página 2 de 5',
      );
    });

    it('should show "Página 1 de 1" when single page', () => {
      component.currentPage = 1;
      component.totalPages = 1;
      fixture.detectChanges();

      const indicator = fixture.debugElement.query(By.css('.page-indicator'));
      expect(indicator.nativeElement.textContent.trim()).toBe(
        'Página 1 de 1',
      );
    });
  });

  // --- Navigation Events ---

  describe('Navigation events', () => {
    it('should emit pageChange with previous page on goToPrevious', () => {
      component.currentPage = 3;
      const emitSpy = jest.spyOn(component.pageChange, 'emit');

      component.goToPrevious();

      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('should not emit pageChange on goToPrevious when on first page', () => {
      component.currentPage = 1;
      const emitSpy = jest.spyOn(component.pageChange, 'emit');

      component.goToPrevious();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit pageChange with next page on goToNext', () => {
      component.currentPage = 1;
      component.totalPages = 3;
      const emitSpy = jest.spyOn(component.pageChange, 'emit');

      component.goToNext();

      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('should not emit pageChange on goToNext when on last page', () => {
      component.currentPage = 3;
      component.totalPages = 3;
      const emitSpy = jest.spyOn(component.pageChange, 'emit');

      component.goToNext();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  // --- Getters ---

  describe('Getters', () => {
    it('should return correct values for isFirstPage', () => {
      component.currentPage = 1;
      expect(component.isFirstPage).toBe(true);

      component.currentPage = 2;
      fixture.detectChanges();
      expect(component.isFirstPage).toBe(false);
    });

    it('should return correct values for isLastPage', () => {
      component.currentPage = 2;
      component.totalPages = 2;
      expect(component.isLastPage).toBe(true);

      component.currentPage = 1;
      fixture.detectChanges();
      expect(component.isLastPage).toBe(false);
    });
  });
});
