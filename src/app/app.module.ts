import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app-routing.module';

import { AppComponent } from './app.component';
import { NativeService } from './shared/services/native.service';
import { TemplateComponent } from './pages/template/template.component';
import { TranslationPipe } from './shared/pipe/translation.pipe';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PackagesComponent } from './packages/packages.component';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    TranslationPipe,
    PackagesComponent,
    TransactionsComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  exports: [TranslationPipe],
  providers: [TranslationPipe],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private nativeService: NativeService) {
    nativeService.SetupNativeService()
  }
 }
