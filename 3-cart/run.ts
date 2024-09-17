import { Cart } from "./cart.service";
import { ProductRepository } from "./product.repository";
import { DiscountType, PromotionRepository } from "./promotion.repository";

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
