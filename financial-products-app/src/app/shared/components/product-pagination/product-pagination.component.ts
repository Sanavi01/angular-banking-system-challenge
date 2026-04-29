import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-pagination.component.html',
  styleUrls: ['./product-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPaginationComponent {
  @Input() totalItems = 0;
  @Input() currentPage = 1;
  @Input() pageSize = 5;
  @Input() totalPages = 1;

  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();

  readonly pageSizeOptions = [5, 10, 20];

  onPageSizeSelect(value: number): void {
    this.pageSizeChange.emit(value);
  }

  goToPrevious(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  goToNext(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  get isFirstPage(): boolean {
    return this.currentPage <= 1;
  }

  get isLastPage(): boolean {
    return this.currentPage >= this.totalPages;
  }

  get resultsText(): string {
    if (this.totalItems === 1) {
      return '1 resultado';
    }
    return `${this.totalItems} resultados`;
  }
}
