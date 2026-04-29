// Angular Standalone Component Template
// Ruta: src/app/<feature>/components/<name>/<name>.component.ts

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-{{component-name}}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './{{component-name}}.component.html',
  styleUrl: './{{component-name}}.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class {{ComponentName}}Component {
  @Input() data: unknown;
  @Output() action = new EventEmitter<unknown>();
}
