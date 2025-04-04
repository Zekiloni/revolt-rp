import { ICartItem, IProduct } from '@revolt-rp/common';


export class ShoppingCartBase {
  shoppingCart: ICartItem<IProduct>[] = [];

  isOutOfStock(product: IProduct) {
    const cartItem = this.shoppingCart.find(item => item.product.name === product.name);
    const cartQuantity = cartItem ? cartItem.quantity : 0;
    return product.stock <= cartQuantity;
  }

  getRealPrice(product: IProduct) {
    return product.price * (1 - (product.discount || 0));
  }

  getTotalItems() {
    return this.shoppingCart.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.shoppingCart.reduce((total, item) => total + this.getRealPrice(item.product) * item.quantity, 0);
  }

  addToCart(product: IProduct) {
    if (this.isOutOfStock(product)) {
      return;
    }

    const shoppingCartItem = this.shoppingCart.find(item => item.product.name === product.name);

    if (shoppingCartItem) {
      shoppingCartItem.quantity++;
    } else {
      this.shoppingCart.push({
        product: product,
        quantity: 1
      });
    }
  }

  removeFromCart(product: IProduct) {
    this.shoppingCart = this.shoppingCart.filter(item => item.product.name !== product.name);
  }
}
