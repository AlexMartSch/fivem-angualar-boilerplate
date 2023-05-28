import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { VipHistory } from '../shared/interfaces/VipData';
import { NativeService } from '../shared/services/native.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PaymentDialogComponent } from '../dialogs/payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'status', 'concept', 'price', 'created_at', 'actions'];
  dataSource: MatTableDataSource<VipHistory>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, public native: NativeService, private router: Router) {
    // Create 100 users
    //const users = Array.from({length: 300}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(native.getVipData().history);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async syncPayment(orderId: number){
    let order = this.dataSource.data.find(d => d.id == orderId)
    if(order){
      order.synced = true

      const response = await this.native.FetchData<{flowToken: string}>('syncronizeTransactions', {orderId}, {success: true})
      if(response.error){
        Swal.fire({
          title: 'Ha ocurrido un error',
          text: response.error,
          icon: 'error',
          background: '#222831',
          color: '#FFFFFF',
        })
      }else{
        setTimeout(() => {
          if (order){
            order.synced = false
            this.closeUI()
          }
        }, 2000);
      }

      
    }
  }

  async continuePayment(orderId: number){
    const response = await this.native.FetchData<{flowToken: string, paymentMethod: string}>('retryTransactionOrder', {orderId})
    if(response.error){
      Swal.fire({
        title: 'Ha ocurrido un error',
        text: response.error,
        icon: 'error',
        background: '#222831',
        color: '#FFFFFF',
      })
    }else{
      
      this.dialog.open(PaymentDialogComponent, {
        width: '95vw',
        maxWidth: '100%',
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '500ms',
        hasBackdrop: true,
        panelClass: 'dialogClass',
        disableClose: true,
        data: {
          flowOrder: response.flowToken,
          payMethod: response.paymentMethod
        }
      });
    }
  }

  async closeUI(){
    const response = await this.native.FetchData('CloseUI', {}, {success:true}) 
    if (!response.error)
      this.router.navigate(['/']) 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPrice(price: number){
    var parts = price.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
  }
}