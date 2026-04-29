import { ProductStateService } from './product-state.service';
import { Product } from '../../../core/models/product.model';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tarjetas de Crédito',
    description: 'Tarjeta de consumo',
    logo: '',
    date_release: '2026-01-01',
    date_revision: '2027-01-01',
  },
  {
    id: '2',
    name: 'Préstamos Personales',
    description: 'Préstamo para necesidades personales a corto plazo',
    logo: '',
    date_release: '2026-01-01',
    date_revision: '2027-01-01',
  },
  {
    id: '3',
    name: 'Cuentas de Ahorro',
    description: 'Cuenta para acumular ahorros con intereses',
    logo: '',
    date_release: '2026-01-01',
    date_revision: '2027-01-01',
  },
  {
    id: '4',
    name: 'Inversión Ágil',
    description: 'Producto de inversión a corto plazo',
    logo: '',
    date_release: '2026-01-01',
    date_revision: '2027-01-01',
  },
  {
    id: '5',
    name: 'Seguro de Vida',
    description: 'Protección financiera para tu familia',
    logo: '',
    date_release: '2026-01-01',
    date_revision: '2027-01-01',
  },
];

describe('ProductStateService', () => {
  let service: ProductStateService;

  beforeEach(() => {
    service = new ProductStateService();
  });

  // --- Filtering ---

  describe('filterProducts', () => {
    it('should return all products when term is empty', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      expect(result.length).toBe(5);
    });

    it('should return all products when term is whitespace only', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('   ');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      expect(result.length).toBe(5);
    });

    it('should filter products by name (case-insensitive)', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('tarjetas');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('should filter products by description (case-insensitive)', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('intereses');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('3');
    });

    it('should filter products by name OR description', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('tarjeta');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      // Matches "Tarjetas de Crédito" (name) AND product with "tarjeta" in description
      const matchingIds = result.map((p) => p.id);
      expect(matchingIds).toContain('1');
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty array when no products match', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('xyz123_nonexistent');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      expect(result.length).toBe(0);
    });

    it('should restore all products when search is cleared', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('tarjeta');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      expect(result.length).toBeLessThan(5); // Filtered

      service.setSearchTerm('');

      expect(result.length).toBe(5); // Restored
    });
  });

  // --- Accent Normalization ---

  describe('Accent normalization', () => {
    it('should find "Préstamos" when searching "prestamos" (without accent)', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('prestamos');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Préstamos Personales');
    });

    it('should find "Préstamos" when searching "préstamos" (with accent)', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('préstamos');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Préstamos Personales');
    });

    it('should find "Crédito" when searching "credito"', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('credito');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Tarjetas de Crédito');
    });

    it('should find "Ágil" when searching "agil"', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('agil');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Inversión Ágil');
    });

    it('should handle uppercase search with accents', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('CRÉDITO');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      expect(result.length).toBe(1);
    });

    it('should normalize "personales" matching product descriptions', () => {
      service.setProducts(MOCK_PRODUCTS);
      service.setSearchTerm('personales');

      let result: Product[] = [];
      service.filteredProducts$.subscribe((p) => (result = p));

      // Should match "personales" in "Préstamos Personales" and description
      expect(result.length).toBe(1);
    });
  });

  // --- Search term pagination reset ---

  describe('Search pagination reset', () => {
    it('should reset currentPage to 1 when search term changes', () => {
      service.setPage(3);
      service.setSearchTerm('tarjeta');

      let currentPage = 0;
      service['currentPage$'].subscribe((p) => (currentPage = p));
      expect(currentPage).toBe(1);
    });
  });

  // --- Cleanup ---

  describe('Cleanup', () => {
    it('should complete destroy$ on destroy', () => {
      const nextSpy = jest.spyOn(service['destroy$'], 'next');
      const completeSpy = jest.spyOn(service['destroy$'], 'complete');
      service.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
