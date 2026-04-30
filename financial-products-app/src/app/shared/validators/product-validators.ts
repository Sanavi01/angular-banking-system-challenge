import { Validators } from '@angular/forms';

export const PRODUCT_VALIDATORS = {
  id: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
  name: [Validators.required, Validators.minLength(5), Validators.maxLength(100)],
  description: [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
  logo: [Validators.required],
  date_release: [Validators.required],
  date_revision: [Validators.required],
};

export const PRODUCT_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  id: {
    required: 'Este campo es requerido',
    minlength: 'El ID debe tener entre 3 y 10 caracteres',
    maxlength: 'El ID debe tener entre 3 y 10 caracteres',
    idExists: 'Este ID ya existe. Elija otro identificador.',
  },
  name: {
    required: 'Este campo es requerido',
    minlength: 'El nombre debe tener entre 5 y 100 caracteres',
    maxlength: 'El nombre debe tener entre 5 y 100 caracteres',
  },
  description: {
    required: 'Este campo es requerido',
    minlength: 'La descripción debe tener entre 10 y 200 caracteres',
    maxlength: 'La descripción debe tener entre 10 y 200 caracteres',
  },
  logo: {
    required: 'Este campo es requerido',
  },
  date_release: {
    required: 'Este campo es requerido',
    dateNotPast: 'La fecha de liberación debe ser igual o posterior a hoy',
  },
  date_revision: {
    required: 'Este campo es requerido',
  },
};
