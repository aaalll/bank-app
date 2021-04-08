import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { DemoMaterialModule } from './material-module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BankListComponent } from './bank-list/bank-list.component';
import { BankDetailComponent } from './bank-detail/bank-detail.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NotfoundComponent } from './notfound/notfound.component';
@NgModule({
  declarations: [
    AppComponent,
    BankListComponent,
    BankDetailComponent,
    BreadcrumbComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
