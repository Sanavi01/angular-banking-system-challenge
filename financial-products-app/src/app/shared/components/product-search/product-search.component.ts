import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() placeholder = 'Search...';
  @Output() searchChange = new EventEmitter<string>();

  searchControl = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((term) => {
        this.searchChange.emit(term.trim());
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
