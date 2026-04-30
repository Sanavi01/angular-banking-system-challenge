import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductMenuComponent } from './product-menu.component';

describe('ProductMenuComponent', () => {
  let component: ProductMenuComponent;
  let fixture: ComponentFixture<ProductMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductMenuComponent);
    component = fixture.componentInstance;
    component.productId = 'trj-crd';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render menu trigger button', () => {
    const trigger = fixture.debugElement.query(By.css('.menu-trigger'));
    expect(trigger).toBeTruthy();
  });

  it('should not show dropdown initially', () => {
    const dropdown = fixture.debugElement.query(By.css('.menu-dropdown'));
    expect(dropdown).toBeFalsy();
  });

  it('should open dropdown when trigger is clicked', () => {
    const trigger = fixture.debugElement.query(By.css('.menu-trigger'));
    trigger.nativeElement.click();
    fixture.detectChanges();

    const dropdown = fixture.debugElement.query(By.css('.menu-dropdown'));
    expect(dropdown).toBeTruthy();
  });

  it('should close dropdown when trigger is clicked again', () => {
    const trigger = fixture.debugElement.query(By.css('.menu-trigger'));
    trigger.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.menu-dropdown'))).toBeTruthy();

    trigger.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.menu-dropdown'))).toBeFalsy();
  });

  it('should emit edit event with productId when "Editar" is clicked', () => {
    const emitSpy = jest.spyOn(component.edit, 'emit');

    const trigger = fixture.debugElement.query(By.css('.menu-trigger'));
    trigger.triggerEventHandler('click', { stopPropagation: () => {} });
    fixture.detectChanges();

    const editBtn = fixture.debugElement.queryAll(By.css('.menu-item'))[0];
    editBtn.nativeElement.click();

    expect(emitSpy).toHaveBeenCalledWith('trj-crd');
  });

  it('should emit delete event with productId when "Eliminar" is clicked', () => {
    const emitSpy = jest.spyOn(component.delete, 'emit');

    const trigger = fixture.debugElement.query(By.css('.menu-trigger'));
    trigger.triggerEventHandler('click', { stopPropagation: () => {} });
    fixture.detectChanges();

    const deleteBtn = fixture.debugElement.queryAll(By.css('.menu-item'))[1];
    deleteBtn.nativeElement.click();

    expect(emitSpy).toHaveBeenCalledWith('trj-crd');
  });

  it('should close dropdown when clicking outside', () => {
    component.isOpen = true;
    fixture.detectChanges();
    expect(component.isOpen).toBe(true);

    document.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.isOpen).toBe(false);
  });

  it('should render "Editar" and "Eliminar" options in dropdown', () => {
    const trigger = fixture.debugElement.query(By.css('.menu-trigger'));
    trigger.triggerEventHandler('click', { stopPropagation: () => {} });
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.menu-item'));
    expect(items.length).toBe(2);
    expect(items[0].nativeElement.textContent.trim()).toBe('Editar');
    expect(items[1].nativeElement.textContent.trim()).toBe('Eliminar');
  });
});
