import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NativeService } from 'src/app/shared/services/native.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PaymentDialogComponent {
  loading: boolean = false;
  
  flowUrl: string = "https://sandbox.flow.cl/app/web/pay.php?token=";
  paypalUrl: string = "https://www.sandbox.paypal.com/checkoutnow?token="

  platformToken!: string;
  paymentMethod!: string
  paymentUrl!: string

  noTokenGiven: boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    public native: NativeService) { 
      this.paymentMethod = data.payMethod

      if (this.paymentMethod == "flow"){
        this.platformToken = data.platformToken
        this.paymentUrl = this.flowUrl + this.platformToken
      }else if(this.paymentMethod == "paypal"){
        this.platformToken = data.platformToken
        this.paymentUrl = this.paypalUrl + this.platformToken
      }

      setTimeout(() => {
        if(!this.paymentUrl){
          this.noTokenGiven = true
        }
      }, 5000);

      this.native.needCloseDialog().subscribe(() => {
        dialogRef.close()
      })
    }

    async cancelOrder(){
      await Swal.fire({
        title: '¿Está seguro?',
        text: "Esta a punto de cancelar la transacción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, cancelar transacción.',
        cancelButtonText: 'Volver',
        background: '#222831',
        color: '#FFFFFF',
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loading = true

          const response = await this.native.FetchData<{transactionId: number}>('cancelTransactionOrderByPlatformToken', {platformToken: this.platformToken}, {
            //success: true
            error: 'test'
          })
    
          if (response.error){
            this.loading = false
            Swal.fire({
              title: 'Ha ocurrido un error',
              text: response.error,
              icon: 'error',
              background: '#222831',
              color: '#FFFFFF',
            })
          }else{
            setTimeout(() => {
              this.native.updateStatus(response.transactionId, 4)
              this.loading = false
              this.dialogRef.close()
            }, 1500);
          }
        }
      })
    }

    close(){
      this.dialogRef.close()
    }
}
