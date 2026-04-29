// Angular Standalone Page Template
// Ruta: src/app/features/<feature>/pages/<name>/<name>.page.ts

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { {{ServiceName}} } from '../../../core/services/{{service-name}}.service';
import { {{ModelName}} } from '../../../core/models/{{model-name}}.model';

@Component({
  selector: 'app-{{page-name}}',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './{{page-name}}.page.html',
  styleUrl: './{{page-name}}.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class {{PageName}}Page implements OnInit {
  data$: Observable<{{ModelName}}[]> = new Observable();

  constructor(
    private service: {{ServiceName}},
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.data$ = this.service.getAll();
  }
}
