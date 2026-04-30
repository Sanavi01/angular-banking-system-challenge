import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-menu.component.html',
  styleUrls: ['./product-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductMenuComponent {
  @Input() productId = '';
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  isOpen = false;

  toggle(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  onEdit(): void {
    this.edit.emit(this.productId);
    this.isOpen = false;
  }

  onDelete(): void {
    this.delete.emit(this.productId);
    this.isOpen = false;
  }

  @HostListener('document:click')
  onClickOutside(): void {
    this.isOpen = false;
  }
}
