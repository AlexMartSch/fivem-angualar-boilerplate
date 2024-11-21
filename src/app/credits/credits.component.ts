import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NativeService } from '../shared/services/native.service';
import { PreOrderDialogComponent } from '../dialogs/pre-order-dialog/pre-order-dialog.component';
import { VipPackage } from '../shared/interfaces/VipData';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent {

  creditsPackages: VipPackage[] = []

  constructor(public dialog: MatDialog, public native: NativeService) {
    this.creditsPackages = native.getVipData().packages.filter(p => (p.credits && p.credits > 0))
  }

  openDialog(vipPackage: VipPackage): void {
    this.dialog.open(PreOrderDialogComponent, {
      width: '900px',
      enterAnimationDuration: '600ms',
      exitAnimationDuration: '700ms',
      hasBackdrop: true,
      panelClass: 'dialogClass',
      disableClose: true,
      data: {
        package: vipPackage
      }
    });
  }

  getPrice(price: number){
    var parts = price.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
  }

  isFreePackage(vipPackage: VipPackage): boolean{
    let isFree = false;
    
    if(vipPackage.prices.CLP === 0) isFree = true;
    if(vipPackage.prices.USD === 0) isFree = true;


    return isFree
  }
}
