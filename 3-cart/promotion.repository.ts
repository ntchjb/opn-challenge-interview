export type FreebiesProduct = {
  productAId: number;
  productBId: number;
  AQuantity: number;
  BQuantity: number;
};

export enum DiscountType {
  FIXED,
  PERCENTAGE,
}

export type Discount = {
  name: string;
} & (
  | {
      type: DiscountType.FIXED;
      deductAmountTHB: number;
    }
  | {
      type: DiscountType.PERCENTAGE;
      maxDeductAmountTHB: number;
      precentage: number;
    }
);

export class PromotionRepository {
  constructor(
    private buyAGetBPromotions: { [productId: number]: FreebiesProduct },
    private discounts: { [name: string]: Discount },
  ) {}

  public getBuyAGetBPromotion(productAId: number): FreebiesProduct | undefined {
    return this.buyAGetBPromotions[productAId];
  }

  public getDiscount(name: string): Discount {
    return this.discounts[name];
  }
}
