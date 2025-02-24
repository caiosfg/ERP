import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonHomeComponent } from './modules/person/page/person-home/person-home.component';
import { ProductComponent } from './modules/product/page/product-home/product.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: PersonHomeComponent
  },
  {
    path: 'product',
    component: ProductComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
