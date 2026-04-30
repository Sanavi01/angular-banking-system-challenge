import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadComponent: () =>
      import(
        './features/products/pages/product-list/product-list.page'
      ).then((m) => m.ProductListPage),
  },
  {
    path: 'products/add',
    loadComponent: () =>
      import(
        './features/products/pages/product-form/product-form.page'
      ).then((m) => m.ProductFormPage),
  },
  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import(
        './features/products/pages/product-form/product-form.page'
      ).then((m) => m.ProductFormPage),
  },
];
