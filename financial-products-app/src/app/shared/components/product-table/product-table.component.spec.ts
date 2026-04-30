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

const TID = (id: string) => `[data-testid="${id}"]`;

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

  describe('Loading State', () => {
    it('should show loading indicator when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css(`${TID('state-loading')} .spinner`));
      expect(spinner).toBeTruthy();
      const el = fixture.debugElement.query(By.css(TID('state-loading')));
      expect(el.nativeElement.textContent).toContain('Cargando productos');
    });

    it('should not render table when loading', () => {
      component.loading = true;
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css(TID('product-table')));
      expect(table).toBeFalsy();
    });
  });

  describe('Error State', () => {
    it('should show error message when error is provided', () => {
      component.error = 'Error al cargar los productos.';
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css(TID('state-error')));
      expect(el).toBeTruthy();
      expect(el.nativeElement.textContent).toContain('Error al cargar los productos.');
    });

    it('should not render table when there is an error', () => {
      component.error = 'Test error';
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css(TID('product-table')));
      expect(table).toBeFalsy();
    });
  });

  describe('Empty State', () => {
    it('should show empty state message when products array is empty', () => {
      component.products = [];
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css(TID('state-empty')));
      expect(el).toBeTruthy();
      expect(el.nativeElement.textContent).toContain('No se encontraron productos financieros.');
    });

    it('should not render table when products array is empty', () => {
      component.products = [];
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css(TID('product-table')));
      expect(table).toBeFalsy();
    });
  });

  describe('Table Structure', () => {
    beforeEach(() => {
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();
    });

    it('should render table with correct columns', () => {
      const headers = fixture.debugElement.queryAll(By.css('thead th'));
      const headerTexts = headers.map((h) => h.nativeElement.textContent.trim());
      expect(headers.length).toBe(6);
      expect(headerTexts[0]).toContain('Logo');
      expect(headerTexts[1]).toContain('Nombre del producto');
      expect(headerTexts[2]).toContain('Descripción');
      expect(headerTexts[3]).toContain('Fecha de liberación');
      expect(headerTexts[4]).toContain('Fecha de reestructuración');
    });

    it('should render correct number of rows', () => {
      const rows = fixture.debugElement.queryAll(By.css(TID('table-row')));
      expect(rows.length).toBe(2);
    });

    it('should apply alternating row style', () => {
      const rows = fixture.debugElement.queryAll(By.css(TID('table-row')));
      expect(rows[0].classes['alt-row']).toBeFalsy();
      expect(rows[1].classes['alt-row']).toBe(true);
    });
  });

  describe('Product Data', () => {
    beforeEach(() => {
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();
    });

    it('should render product names correctly', () => {
      const nameCells = fixture.debugElement.queryAll(By.css(TID('cell-name')));
      expect(nameCells[0].nativeElement.textContent).toContain('Tarjetas de Crédito');
      expect(nameCells[1].nativeElement.textContent).toContain('Tarjetas de Débito');
    });

    it('should render product descriptions correctly', () => {
      const descCells = fixture.debugElement.queryAll(By.css(TID('cell-description')));
      expect(descCells[0].nativeElement.textContent).toContain('Tarjeta de consumo bajo la modalidad de crédito');
    });

    it('should format dates as DD/MM/YYYY', () => {
      const dateCells = fixture.debugElement.queryAll(By.css(`${TID('cell-date_release')}, ${TID('cell-date_revision')}`));
      const dateTexts = dateCells.map((d) => d.nativeElement.textContent.trim());
      expect(dateTexts[0]).toBe('01/06/2026');
      expect(dateTexts[1]).toBe('01/06/2027');
      expect(dateTexts[2]).toBe('15/05/2026');
      expect(dateTexts[3]).toBe('15/05/2027');
    });

    it('should render logo images with correct src', () => {
      const logoImages = fixture.debugElement.queryAll(By.css(TID('logo-image')));
      expect(logoImages.length).toBe(2);
      expect(logoImages[0].nativeElement.src).toBe(MOCK_PRODUCTS[0].logo);
      expect(logoImages[1].nativeElement.src).toBe(MOCK_PRODUCTS[1].logo);
    });
  });

  describe('Logo Fallback', () => {
    it('should show placeholder when product has no logo', () => {
      const productsWithoutLogo = MOCK_PRODUCTS.map((p) => ({ ...p, logo: '' }));
      component.products = productsWithoutLogo;
      fixture.detectChanges();

      const placeholders = fixture.debugElement.queryAll(By.css(TID('logo-placeholder')));
      expect(placeholders.length).toBe(2);
    });

    it('should display product initial in placeholder', () => {
      const productsWithoutLogo = MOCK_PRODUCTS.map((p) => ({ ...p, logo: '' }));
      component.products = productsWithoutLogo;
      fixture.detectChanges();

      const placeholders = fixture.debugElement.queryAll(By.css(TID('logo-placeholder')));
      expect(placeholders[0].nativeElement.textContent.trim()).toBe('T');
      expect(placeholders[1].nativeElement.textContent.trim()).toBe('T');
    });

    it('should show image when product has logo', () => {
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();

      const logoImages = fixture.debugElement.queryAll(By.css(TID('logo-image')));
      expect(logoImages.length).toBe(2);
    });

    it('should hide image and show placeholder on image error', () => {
      component.products = MOCK_PRODUCTS;
      fixture.detectChanges();

      const logoImage = fixture.debugElement.query(By.css(TID('logo-image')));
      logoImage.triggerEventHandler('error', { target: logoImage.nativeElement });
      fixture.detectChanges();

      expect(logoImage.nativeElement.style.display).toBe('none');
      const placeholder = fixture.debugElement.query(By.css(TID('logo-placeholder')));
      expect(placeholder).toBeTruthy();
      expect(placeholder.nativeElement.textContent.trim()).toBe('T');
    });
  });

  describe('getInitial', () => {
    it('should return first character uppercase', () => {
      expect(component.getInitial('Tarjetas de Crédito')).toBe('T');
      expect(component.getInitial('cuentas de ahorro')).toBe('C');
      expect(component.getInitial('Préstamos Personales')).toBe('P');
    });
  });
});
