import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankListComponent } from './bank-list/bank-list.component'
import { BankDetailComponent } from './bank-detail/bank-detail.component'
import { NotfoundComponent } from './notfound/notfound.component';
const routes: Routes = [
  {
    path: 'banks', data: { breadcrumb: 'Banks', },
    children: [
      { path: '', component: BankListComponent, data: { breadcrumb: '', }, },
      { path: 'new', component: BankDetailComponent, data: { breadcrumb: 'Create bank', }, },
      { path: ':id', component: BankDetailComponent, data: { breadcrumb: 'Update bank', }, },
      {path: '404', component: NotfoundComponent},
      {path: '**', redirectTo: '/404'}
    ]
  },
  { path: '', redirectTo: '/banks', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
