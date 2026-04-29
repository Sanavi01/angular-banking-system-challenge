import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { DateDisplayPipe } from '../../pipes/date-display.pipe';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, DateDisplayPipe],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableComponent {
  @Input() products: Product[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  onImageError(event: Event, product: Product): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const placeholder = img.nextElementSibling as HTMLElement;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
