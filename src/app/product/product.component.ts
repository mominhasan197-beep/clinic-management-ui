import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductComponent {
  @Input() product!: any;  // Ensure this input is defined properly

  selectedProduct: any = null;  // Track the selected product

  cart: any[] = [];  // Array to store items added to the cart

  // Method to expand product details within the same page
  selectProduct(product: any) {
    this.selectedProduct = product;
  }

  addToCart(product: any) {
    const existingProduct = this.cart.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1; // Increase quantity if exists
    } else {
      this.cart.push({ ...product, quantity: 1 }); // Add new product
    }
    console.log('Product added to cart:', product);
    console.log('Current cart:', this.cart);
  }
}
