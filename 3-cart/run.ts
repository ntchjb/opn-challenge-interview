type CartProduct = {
  id: number;
  quantity: number;
};

type Product = {
  id: number;
  name: string;
  priceTHB: number;
};

enum DiscountType {
  FIXED,
  PERCENTAGE,
}

type Discount = {
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

export class ProductRepository {
  constructor(private products: { [id: number]: Product }) {}

  public getProduct(id: number): Product | undefined {
    return this.products[id];
  }
}

type FreebiesProduct = {
  productAId: number;
  productBId: number;
  AQuantity: number;
  BQuantity: number;
};

type TotalCosts = {
  total: number;
  original: number;
  freebies: number;
  voucher: number;
};

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

function run() {
  const productRepository = new ProductRepository({
    1: {
      id: 1,
      name: 'Lays potato original Family size',
      priceTHB: 5500,
    },
    2: {
      id: 2,
      name: 'Protex fresh 600ml',
      priceTHB: 19900,
    },
    3: {
      id: 3,
      name: 'Downey Blue 2.1L',
      priceTHB: 23500,
    },
    4: {
      id: 4,
      name: 'Lays potato original mini',
      priceTHB: 1000,
    },
  });

  const promotionRepository = new PromotionRepository(
    {
      1: {
        AQuantity: 3,
        BQuantity: 2,
        productAId: 1,
        productBId: 4,
      },
    },
    {
      SUPERSATURDAY: {
        name: 'SUPERSATURDAY',
        type: DiscountType.FIXED,
        deductAmountTHB: 50000,
      },
      LUNCH: {
        name: 'LUNCH',
        type: DiscountType.FIXED,
        deductAmountTHB: 5000,
      },
      ALLYOUGET34: {
        name: 'ALLYOUGET34',
        type: DiscountType.PERCENTAGE,
        maxDeductAmountTHB: 1000000,
        precentage: 40,
      },
    },
  );

  const cart = new Cart(promotionRepository, productRepository);

  console.log(`IsEmpty: ${cart.isEmpty()}`);
  cart.addProduct(1, 5);
  cart.addProduct(2, 1);
  cart.addProduct(3, 2);
  cart.addProduct(4, 1);
  cart.removeProduct(2, 1);
  cart.updateProduct(3, 5);
  cart.addDiscount('LUNCH');
  cart.addDiscount('ALLYOUGET34');
  cart.addDiscount('SUPERSATURDAY');
  cart.removeDiscount('SUPERSATURDAY');
  console.log(cart.getProducts());
  console.log(`IsEmpty: ${cart.isEmpty()}`);
  console.log(`Total cost:`, cart.getTotalCost());
  console.log(`Is empty: ${cart.isEmpty()}`);
  console.log(`is product 2 exist: ${cart.isProductExist(2)}`);
  console.log(`is product 3 exist: ${cart.isProductExist(3)}`);
  console.log(`item count: ${cart.itemCount()}`);
  console.log(`unique item count: ${cart.uniqueItemCount()}`);
}

run();
