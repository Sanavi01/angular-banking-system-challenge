// Jest Pipe Test Template for Angular
// Ruta: src/app/<path>/<name>.pipe.spec.ts

import { {{PipeName}}Pipe } from './{{pipe-name}}.pipe';

describe('{{PipeName}}Pipe', () => {
  let pipe: {{PipeName}}Pipe;

  beforeEach(() => {
    pipe = new {{PipeName}}Pipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
