import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from './app.routes';
import { Component } from '@angular/core';

// Stub components to avoid lazy-loading actual pages
@Component({ standalone: true, template: '' })
class StubProductListPage {}

@Component({ standalone: true, template: '' })
class StubProductFormPage {}

describe('AppRoutes', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', redirectTo: '/products', pathMatch: 'full' },
          { path: 'products', component: StubProductListPage },
          { path: 'products/add', component: StubProductFormPage },
          { path: 'products/edit/:id', component: StubProductFormPage },
        ]),
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should redirect empty path to /products', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('/products');
  });

  it('should navigate to /products', async () => {
    await router.navigate(['/products']);
    expect(location.path()).toBe('/products');
  });

  it('should navigate to /products/add', async () => {
    await router.navigate(['/products/add']);
    expect(location.path()).toBe('/products/add');
  });

  it('should navigate to /products/edit/:id', async () => {
    await router.navigate(['/products/edit', 'test-id']);
    expect(location.path()).toBe('/products/edit/test-id');
  });

  it('should have exactly 4 routes defined', () => {
    expect(routes.length).toBe(4);
  });

  it('should have redirect route as first route', () => {
    expect(routes[0].path).toBe('');
    expect(routes[0].redirectTo).toBe('/products');
    expect(routes[0].pathMatch).toBe('full');
  });

  it('should have products route with lazy loading', () => {
    expect(routes[1].path).toBe('products');
    expect(typeof routes[1].loadComponent).toBe('function');
  });

  it('should have products/add route with lazy loading', () => {
    expect(routes[2].path).toBe('products/add');
    expect(typeof routes[2].loadComponent).toBe('function');
  });

  it('should have products/edit/:id route with lazy loading', () => {
    expect(routes[3].path).toBe('products/edit/:id');
    expect(typeof routes[3].loadComponent).toBe('function');
  });
});
