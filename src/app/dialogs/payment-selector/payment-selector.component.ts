import { Component, Inject } from '@angular/core';
import { NativeService } from 'src/app/shared/services/native.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentMethod, VipHistory, VipPackage } from 'src/app/shared/interfaces/VipData';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-payment-selector',
  templateUrl: './payment-selector.component.html',
  styleUrls: ['./payment-selector.component.scss']
})
export class PaymentSelectorComponent {

  vipPackage!: VipPackage

  selectedPaymentMethod!: string
  
  loading: boolean = false;
  errorMsg: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    public native: NativeService) { 
      this.vipPackage = data.vipPackage
      this.native.needCloseDialog().subscribe(() => {
        this.close()
      })
    }

    processPaymentsMethodWithCurrency(){
      let availablePayments = this.native.getVipData().payments
      let enablePayments: any[] = []

      availablePayments.forEach(payment => {
        if((payment == "flow" || payment == "mercadopago" || payment == "fintoc") && this.vipPackage.prices.CLP){
          enablePayments.push(payment)
        }else if(payment == "paypal" && this.vipPackage.prices.USD){
          enablePayments.push(payment)
        }else if(payment == "credits" && this.vipPackage.prices.CREDITS){
          enablePayments.push(payment)
        }
      })

      return enablePayments
    }

    async selectPaymentMethod(id: string){
      if(!this.loading)
        this.selectedPaymentMethod = id
    }

    async confirmBuy(){
      this.errorMsg = ''
      this.loading = true
  
      const response = await this.native.FetchData<{platformToken: string, transaction: VipHistory}>('createTransactionOrder', {internalId: this.vipPackage.InternalID, paymentMethod: this.selectedPaymentMethod}, {
        platformToken: "pi_eXp1RgS79NGpwWbo_sec_VisQFhEi7BPBux612qNk7uji",
        transaction: {
          id          : 1,
          internalId  : "string",
          subject     : "string",
          price       : 1000,
          status      : 1,
          synced     : false
        }
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

          if (this.selectedPaymentMethod == 'credits' || this.selectedPaymentMethod == 'free'){
            return
          }

          this.dialog.open(PaymentDialogComponent, {
            width: '95vw',
            maxWidth: '100%',
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '500ms',
            hasBackdrop: true,
            panelClass: 'dialogClass',
            disableClose: true,
            data: {
              platformToken: response.platformToken,
              payMethod: this.selectedPaymentMethod
            }
          });
        }, 2000);
      }
  
    }

    getPaymentMethodDetails(id: string): PaymentMethod | undefined{
      return this.native.paymentsMethods.find(pm => pm.id === id)
    }

    close(){
      this.dialogRef.close()
    }
}
