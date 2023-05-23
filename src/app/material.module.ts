import { NgModule } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';



const Material: any[] = [
    MatTabsModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule
]

@NgModule({
    imports: Material,
    exports: Material
})
export class MaterialModule {}