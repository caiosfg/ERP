import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonHomeComponent } from './modules/person/page/person-home/person-home.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
