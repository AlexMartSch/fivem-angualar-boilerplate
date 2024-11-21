import { HttpClientModule } from '@angular/common/http';
import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
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
import { PreOrderDialogComponent } from './dialogs/pre-order-dialog/pre-order-dialog.component';
import { SafePipe } from './shared/pipe/sanitizeUrl.pipe';
import { PaymentSelectorComponent } from './dialogs/payment-selector/payment-selector.component';
import { LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule, ScrollHooks } from 'ng-lazyload-image';
import { PaymentDialogComponent } from './dialogs/payment-dialog/payment-dialog.component';
import { CreditsComponent } from './credits/credits.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    TranslationPipe,
    PackagesComponent,
    TransactionsComponent,
    PreOrderDialogComponent,
    SafePipe,
    PaymentSelectorComponent,
    PaymentDialogComponent,
    CreditsComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    LazyLoadImageModule
  ],
  exports: [TranslationPipe],
  providers: [
    TranslationPipe,
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'CLP' },
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private nativeService: NativeService) {
    nativeService.SetupNativeService()
  }
 }
