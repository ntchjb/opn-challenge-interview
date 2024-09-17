export type Product = {
  id: number;
  name: string;
  priceTHB: number;
};

export class ProductRepository {
  constructor(private products: { [id: number]: Product }) {}

  public getProduct(id: number): Product | undefined {
    return this.products[id];
  }
}
