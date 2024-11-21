import { AfterViewInit, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getFintoc } from '@fintoc/fintoc-js';
import { NativeService } from 'src/app/shared/services/native.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PaymentDialogComponent implements AfterViewInit {
  loading: boolean = false;
  
  flowUrl: string = "https://sandbox.flow.cl/app/web/pay.php?token=";
  paypalUrl: string = "https://www.sandbox.paypal.com/checkoutnow?token="
  mercadopagoUrl: string = "https://sandbox.mercadopago.cl/checkout/v1/redirect?pref_id="

  fintoc!: any
  fintocWidget!: any

  platformToken!: string;
  paymentMethod!: string
  paymentUrl!: string

  noTokenGiven: boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    public native: NativeService) { 
      this.paymentMethod = data.payMethod

      this.platformToken = data.platformToken
      if (this.paymentMethod == "flow"){
        this.paymentUrl = this.flowUrl + this.platformToken
      }else if(this.paymentMethod == "paypal"){
        this.paymentUrl = this.paypalUrl + this.platformToken
      }else if(this.paymentMethod == "mercadopago"){
        this.paymentUrl = this.mercadopagoUrl + this.platformToken
        Swal.fire({
          title: 'Atención',
          html: "Por limitaciones de FiveM, no es posible <i>'Pagar desde la web'</i>. <br>Como alternativa, usa la opción <i>'Pagar con tu celular'</i> usando la aplicación de MercadoPago.",
          icon: 'warning',
          width: 800,
          showCancelButton: false,
          confirmButtonColor: '#f4df4e',
          confirmButtonText: 'ENTIENDO',
          background: '#222831',
          color: '#FFFFFF',
        })
      }else if(this.paymentMethod == "fintoc"){
        this.loadFintocData()
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

    ngAfterViewInit(): void {
      const iframe = document.getElementById('paymentflow') as HTMLIFrameElement
      let payClicked = 0
      if(iframe){

        iframe.addEventListener('load', () => {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
          if(!iframeDocument) return

          const pagarButton = iframeDocument.getElementById('pagar');
          if(!pagarButton) return

          pagarButton.addEventListener('click', () => {
            payClicked++

            if(payClicked >= 2){
              Swal.fire({
                title: '¡Bien hecho!',
                text: "Estamos acreditando el pago, por favor espere unos segundos.",
                icon: 'info',
                showCancelButton: false,
                confirmButtonColor: '#f4df4e',
                confirmButtonText: 'ENTIENDO',
                background: '#222831',
                color: '#FFFFFF',
                timer: 5000,
                didOpen: () => {
                  Swal.showLoading();
                },
                allowOutsideClick: () => !Swal.isLoading(),
                preConfirm: async () => {
                  const result = await this.native.FetchData('checkTransactionOrder', {
                    platformToken: this.platformToken,
                    paymentMethod: this.paymentMethod
                  })
                },
              })
            }
            
          })
        })
      }
    }

    async loadFintocData(){
      this.fintoc = await getFintoc()
      this.fintocWidget = this.fintoc.create({
        widgetToken: this.platformToken,
        publicKey: 'pk_test_BirdGigtsnuzVztKjLt1ZF52zNCYfQPY',
        holderType: 'individual',
        product: 'payments',
        onSuccess: async () => {
          await Swal.fire({
            title: 'Pago realizado',
            text: "El pago se ha realizado con éxito.",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#f4df4e',
            confirmButtonText: 'ENTIENDO',
            background: '#222831',
            color: '#FFFFFF',
          })
          this.fintocWidget.destroy()
          this.dialogRef.close()
        },
        onExit: async () => {
          await Swal.fire({
            title: 'Pago pausado',
            text: "Puede volver a pagar en cualquier momento.",
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#f4df4e',
            confirmButtonText: 'ENTIENDO',
            background: '#222831',
            color: '#FFFFFF',
          })
          this.fintocWidget.destroy()
          this.dialogRef.close()
        },
      })
      this.paymentUrl = 'fintoc'

      this.fintocWidget.open()

      try {
        
      } catch (error) {
        Swal.fire({
          title: 'Ha ocurrido un error',
          text: "El tiempo de pago se agotó, vuelva a su lista de transacciones o creé una nueva.",
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#f4df4e',
          confirmButtonText: 'ENTIENDO',
          background: '#222831',
          color: '#FFFFFF',
        })
        this.dialogRef.close()
      }
      
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

          const response = await this.native.FetchData<{transactionId: number}>('cancelTransactionOrderByPlatformToken', {platformToken: this.platformToken})
    
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
