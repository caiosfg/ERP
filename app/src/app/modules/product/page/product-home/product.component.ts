import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  constructor(private productService: ProductService) { }
  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.productService.getAllProducts()
    .subscribe({
      next: (response) => {
        console.log("🚀 ~ ProductComponent ~ getAllProducts ~ response:", response)
      },
      error: (error) => console.log('error', error),
    })
  }
}
