import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductMenuComponent } from './product-menu.component';

const TID = (id: string) => `[data-testid="${id}"]`;

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
    const trigger = fixture.debugElement.query(By.css(TID('menu-trigger')));
    expect(trigger).toBeTruthy();
  });

  it('should not show dropdown initially', () => {
    const dropdown = fixture.debugElement.query(By.css(TID('menu-dropdown')));
    expect(dropdown).toBeFalsy();
  });

  it('should open dropdown when trigger is clicked', () => {
    const trigger = fixture.debugElement.query(By.css(TID('menu-trigger')));
    trigger.nativeElement.click();
    fixture.detectChanges();
    const dropdown = fixture.debugElement.query(By.css(TID('menu-dropdown')));
    expect(dropdown).toBeTruthy();
  });

  it('should close dropdown when trigger is clicked again', () => {
    const trigger = fixture.debugElement.query(By.css(TID('menu-trigger')));
    trigger.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css(TID('menu-dropdown')))).toBeTruthy();
    trigger.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css(TID('menu-dropdown')))).toBeFalsy();
  });

  it('should emit edit event with productId', () => {
    const emitSpy = jest.spyOn(component.edit, 'emit');
    const trigger = fixture.debugElement.query(By.css(TID('menu-trigger')));
    trigger.triggerEventHandler('click', { stopPropagation: () => {} });
    fixture.detectChanges();
    const editBtn = fixture.debugElement.query(By.css(TID('menu-item-edit')));
    editBtn.nativeElement.click();
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

  it('should render "Editar" option in dropdown', () => {
    const trigger = fixture.debugElement.query(By.css(TID('menu-trigger')));
    trigger.triggerEventHandler('click', { stopPropagation: () => {} });
    fixture.detectChanges();
    const editBtn = fixture.debugElement.query(By.css(TID('menu-item-edit')));
    expect(editBtn.nativeElement.textContent.trim()).toBe('Editar');
  });
});
