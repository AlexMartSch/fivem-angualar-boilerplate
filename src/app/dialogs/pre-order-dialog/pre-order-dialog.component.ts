import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NativeService } from 'src/app/shared/services/native.service';
import { VipHistory, VipPackage } from 'src/app/shared/interfaces/VipData';
import { PaymentSelectorComponent } from '../payment-selector/payment-selector.component';

@Component({
  selector: 'app-pre-order-dialog',
  templateUrl: './pre-order-dialog.component.html',
  styleUrls: ['./pre-order-dialog.component.scss']
})
export class PreOrderDialogComponent {

  loading: boolean = false;
  errorMsg: string = ""
  vipPackage!: VipPackage

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PreOrderDialogComponent>,
    public native: NativeService) {
      this.vipPackage = data.package
    }

  async continuePayments(){
    this.dialogRef.close()
    this.dialog.open(PaymentSelectorComponent, {
      width: '80vw',
      maxWidth: '100%',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '500ms',
      hasBackdrop: true,
      panelClass: 'dialogClass',
      disableClose: true,
      data: {
        vipPackage: this.vipPackage
      }
    });

  }

  async generateFreeOrder(){
    const response = await this.native.FetchData<{platformToken: string, transaction: VipHistory}>('createTransactionOrder', {internalId: this.vipPackage.InternalID, paymentMethod: "free"}, {
      //error: "ABP - ErrX42"
      transaction: {}
    })

    if (response.error){
      this.errorMsg = response.error
      this.loading = false
    }else{
      setTimeout(() => {
        this.loading = false
        this.dialogRef.close()
        
        response.transaction.buy_at = new Date()
        this.native.addViphistory(response.transaction)
      }, 2000);
    }
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

  close(){
    this.dialogRef.close()
  }
}
