import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/interfaces/product.interface'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productData !: Product;
  constructor(private productService: ProductService) { }
  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.productService.getAllProducts()
    .subscribe({
      next: (response) => {
        response && (this.productData = response)
        console.log("🚀 ~ ProductComponent ~ getAllProducts ~ response:", this.productData)
      },
      error: (error) => console.log('error', error),
    })
  }
}
