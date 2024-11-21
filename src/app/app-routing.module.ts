import { Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { TemplateComponent } from "./pages/template/template.component";
import { PackagesComponent } from "./packages/packages.component";
import { TransactionsComponent } from "./transactions/transactions.component";
import { CreditsComponent } from "./credits/credits.component";

export const appRoutes: Routes = [
    {
        path: '',
        component: AppComponent
    },
    {
        path: 'cad',
        component: TemplateComponent,
        children: [
            {
                path: 'packages',
                component: PackagesComponent
            },
            {
                path: 'transactions',
                component: TransactionsComponent
            },
            {
                path: 'credits',
                component: CreditsComponent
            }
        ]
    }

]