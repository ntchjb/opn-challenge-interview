import { ProductRepository } from './product.repository';
import {
  Discount,
  DiscountType,
  PromotionRepository,
} from './promotion.repository';

export type CartProduct = {
  id: number;
  quantity: number;
};

export type TotalCosts = {
  total: number;
  original: number;
  freebies: number;
  voucher: number;
};

export class Cart {
  private products: { [id: number]: CartProduct } = {};
  private discounts: { [name: string]: Discount } = {};

  constructor(
    private promotionRepository: PromotionRepository,
    private productRepository: ProductRepository,
  ) {}

  public getProduct(productId: number): CartProduct | undefined {
    return this.products[productId];
  }

  private addSingleProduct(product: CartProduct): CartProduct {
    const existing = this.getProduct(product.id);
    const newProduct = { ...product };
    if (!existing) {
      this.products[product.id] = { ...newProduct };
    } else {
      newProduct.quantity += existing.quantity;
      this.products[product.id] = newProduct;
    }

    return newProduct;
  }

  public addProduct(productId: number, quantity: number) {
    const newProduct = this.addSingleProduct({
      id: productId,
      quantity,
    });

    const promotion = this.promotionRepository.getBuyAGetBPromotion(productId);
    if (promotion && promotion.AQuantity <= newProduct.quantity) {
      this.addSingleProduct({
        id: promotion.productBId,
        quantity:
          promotion.BQuantity *
          Math.floor(newProduct.quantity / promotion.AQuantity),
      });
    }
  }

  public updateProduct(productId: number, quantity: number) {
    const existing = this.getProduct(productId);
    if (existing) {
      this.products[productId] = { id: productId, quantity };
    } else {
      throw new Error('product not found');
    }
  }

  public removeProduct(productId: number, quantity: number) {
    const existing = this.products[productId];
    if (existing) {
      if (existing.quantity <= quantity) {
        delete this.products[productId];
      } else {
        existing.quantity -= quantity;
      }
    }
  }

  public isProductExist(productId: number): boolean {
    return !!this.products[productId];
  }

  public isEmpty(): boolean {
    return Object.keys(this.products).length === 0;
  }

  public getProducts(): CartProduct[] {
    return Object.values(this.products);
  }

  public uniqueItemCount(): number {
    return Object.keys(this.products).length;
  }

  public itemCount(): number {
    const products = Object.values(this.products);
    let count = 0;
    for (let i = 0, n = products.length; i < n; i++) {
      count += products[i].quantity;
    }

    return count;
  }

  public addDiscount(name: string) {
    const discount = this.promotionRepository.getDiscount(name);
    if (!discount) {
      throw new Error('discount name not found');
    }

    const existing = this.discounts[name];
    if (existing) {
      throw new Error('discount already exists');
    }

    this.discounts[discount.name] = { ...discount };
  }

  public removeDiscount(name: string) {
    delete this.discounts[name];
  }

  public getTotalCost(): TotalCosts {
    const products = Object.values(this.products);
    let totalAmountTHB = 0;
    let freebiesDiscountTHB = 0;
    let voucherDiscountTHB = 0;
    for (let i = 0, n = products.length; i < n; i++) {
      // #1: calculate total cost without promotion
      totalAmountTHB +=
        products[i].quantity *
        this.productRepository.getProduct(products[i].id)!.priceTHB;

      // #2: calculate total cost of freebies
      const buyAGetBPro = this.promotionRepository.getBuyAGetBPromotion(
        products[i].id,
      );
      if (buyAGetBPro && products[i].quantity >= buyAGetBPro.AQuantity) {
        const productB = this.productRepository.getProduct(
          buyAGetBPro.productBId,
        )!;
        freebiesDiscountTHB +=
          buyAGetBPro.BQuantity *
          Math.floor(products[i].quantity / buyAGetBPro.AQuantity) *
          productB.priceTHB;
      }
    }

    // #3: calculate total discount vouchers
    // Assuming that all vouchers are calculated based on total cost
    // which is total original cost deducted by total freebies cost
    const discounts = Object.values(this.discounts);
    for (let i = 0, n = discounts.length; i < n; i++) {
      const discount = discounts[i];
      if (discount.type === DiscountType.FIXED) {
        voucherDiscountTHB += discount.deductAmountTHB;
      } else {
        voucherDiscountTHB += Math.min(
          discount.maxDeductAmountTHB,
          Math.floor(
            ((totalAmountTHB - freebiesDiscountTHB) * discount.precentage) /
              100,
          ),
        );
      }
    }

    return {
      freebies: freebiesDiscountTHB,
      original: totalAmountTHB,
      total: totalAmountTHB - freebiesDiscountTHB - voucherDiscountTHB,
      voucher: voucherDiscountTHB,
    };
  }
}
