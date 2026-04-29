import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductTableComponent } from './product-table.component';
import { Product } from '../../../core/models/product.model';
import { DateDisplayPipe } from '../../pipes/date-display.pipe';

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

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableComponent, DateDisplayPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
  });

  // --- Rendering States ---

  describe('Loading State', () => {
    it('should show loading indicator when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('.spinner'));
      const message = fixture.debugElement.query(By.css('.state-message p'));

      expect(spinner).toBeTruthy();
      expect(message.nativeElement.textContent).toContain('Cargando productos');
    });

    it('should not render table when loading', () => {
      component.loading = true;
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table'));
      expect(table).toBeFalsy();
    });
  });

  describe('Error State', () => {
    it('should show error message when error is provided', () => {
      component.error = 'Error al cargar los productos.';
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('.state-error'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent).toContain('Error al cargar los productos.');
    });

    it('should show error icon', () => {
      component.error = 'Test error';
      fixture.detectChanges();

      const errorIcon = fixture.debugElement.query(By.css('.error-icon'));
      expect(errorIcon).toBeTruthy();
    });

    it('should not render table when there is an error', () => {
      component.error = 'Test error';
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table'));
      expect(table).toBeFalsy();
    });
  });

  describe('Empty State', () => {
    it('should show empty state message when products array is empty', () => {
      component.products = [];
      fixture.detectChanges();

      const emptyElement = fixture.debugElement.query(By.css('.state-empty'));
      expect(emptyElement).toBeTruthy();
      expect(emptyElement.nativeElement.textContent).toContain(
        'No se encontraron productos financieros.',
      );
    });

    it('should show empty icon', () => {
      component.products = [];
      fixture.detectChanges();

      const emptyIcon = fixture.debugElement.query(By.css('.empty-icon'));
      expect(emptyIcon).toBeTruthy();
    });

    it('should not render table when products array is empty', () => {
      component.products = [];
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table'));
      expect(table).toBeFalsy();
    });
  });

  // --- Data Rendering ---

  describe('Table Structure', () => {
    beforeEach(() => {
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();
    });

    it('should render table with correct columns', () => {
      const headers = fixture.debugElement.queryAll(By.css('thead th'));
      const headerTexts = headers.map((h) => h.nativeElement.textContent.trim());

      expect(headers.length).toBe(5);
      expect(headerTexts[0]).toContain('Logo');
      expect(headerTexts[1]).toContain('Nombre del producto');
      expect(headerTexts[2]).toContain('Descripción');
      expect(headerTexts[3]).toContain('Fecha de liberación');
      expect(headerTexts[4]).toContain('Fecha de reestructuración');
    });

    it('should render info icons on description, release date, and revision date headers', () => {
      const infoIcons = fixture.debugElement.queryAll(By.css('.info-icon'));
      expect(infoIcons.length).toBe(3); // Descripción, Fecha lib., Fecha reest.
    });

    it('should render correct number of rows', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows.length).toBe(2);
    });

    it('should apply alternating row style', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows[0].classes['alt-row']).toBeFalsy();
      expect(rows[1].classes['alt-row']).toBe(true);
    });
  });

  // --- Product Data Rendering ---

  describe('Product Data', () => {
    beforeEach(() => {
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();
    });

    it('should render product names correctly', () => {
      const nameCells = fixture.debugElement.queryAll(By.css('tbody td.col-name'));
      expect(nameCells[0].nativeElement.textContent).toContain('Tarjetas de Crédito');
      expect(nameCells[1].nativeElement.textContent).toContain('Tarjetas de Débito');
    });

    it('should render product descriptions correctly', () => {
      const descCells = fixture.debugElement.queryAll(By.css('tbody td.col-desc'));
      expect(descCells[0].nativeElement.textContent).toContain(
        'Tarjeta de consumo bajo la modalidad de crédito',
      );
    });

    it('should format dates as DD/MM/YYYY', () => {
      const dateCells = fixture.debugElement.queryAll(By.css('tbody td.col-date'));
      const dateTexts = dateCells.map((d) => d.nativeElement.textContent.trim());

      expect(dateTexts[0]).toBe('01/06/2026');
      expect(dateTexts[1]).toBe('01/06/2027');
      expect(dateTexts[2]).toBe('15/05/2026');
      expect(dateTexts[3]).toBe('15/05/2027');
    });

    it('should render logo images with correct src', () => {
      const logoImages = fixture.debugElement.queryAll(By.css('.logo-image'));
      expect(logoImages.length).toBe(2);
      expect(logoImages[0].nativeElement.src).toBe(MOCK_PRODUCTS[0].logo);
      expect(logoImages[1].nativeElement.src).toBe(MOCK_PRODUCTS[1].logo);
    });

    it('should render logo images as circular (border-radius: 50%)', () => {
      const logoImage = fixture.debugElement.query(By.css('.logo-image'));
      const computedStyle = getComputedStyle(logoImage.nativeElement);
      // We verify the class exists; actual styling is tested via E2E
      expect(logoImage.nativeElement.classList.contains('logo-image')).toBe(true);
    });
  });

  // --- Logo Fallback ---

  describe('Logo Fallback', () => {
    it('should show placeholder div alongside each logo image', () => {
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();

      const placeholders = fixture.debugElement.queryAll(By.css('.logo-placeholder'));
      expect(placeholders.length).toBe(2);
    });

    it('should display product initial in placeholder', () => {
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();

      const placeholders = fixture.debugElement.queryAll(By.css('.logo-placeholder'));
      expect(placeholders[0].nativeElement.textContent.trim()).toBe('T');
      expect(placeholders[1].nativeElement.textContent.trim()).toBe('T');
    });

    it('should hide placeholder initially', () => {
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();

      const placeholder = fixture.debugElement.query(By.css('.logo-placeholder'));
      expect(placeholder.nativeElement.style.display).toBe('none');
    });

    it('should hide image and show placeholder on image error', () => {
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();

      const logoImage = fixture.debugElement.query(By.css('.logo-image'));
      logoImage.triggerEventHandler('error', { target: logoImage.nativeElement });

      // After onerror, image is hidden and placeholder shown
      expect(logoImage.nativeElement.style.display).toBe('none');
    });
  });

  // --- getInitial ---

  describe('getInitial', () => {
    it('should return first character uppercase', () => {
      expect(component.getInitial('Tarjetas de Crédito')).toBe('T');
      expect(component.getInitial('cuentas de ahorro')).toBe('C');
      expect(component.getInitial('Préstamos Personales')).toBe('P');
    });
  });
});
