export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string; // YYYY-MM-DD
  date_revision: string; // YYYY-MM-DD
}

export interface ProductResponse {
  data: Product[];
}

export interface ProductCreateResponse {
  message: string;
  data: Product;
}
