import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Observable, of, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NativeMessageType } from '../interfaces/NativeMessageType';
import { Settings } from '../interfaces/Settings.interface';
import { PaymentMethod, VipData, VipHistory } from '../interfaces/VipData';


@Injectable({
    providedIn: 'root'
})

export class NativeService {

    private isServiceLoaded = false
    private resourceName = "abp_PayFlow"
    private networkRequestCloseDialogs = new Subject<any>()

    private appSettings: Settings = {
        language: 'en',
        refreshInterval: 5000,
        asAdmin: true,

        scriptName: 'abp_PayFlow',
        categories: [],
        states: [
            {
                status: 3,
                label: "Pending",
            }
        ],
        actions: [
            {
                icon: 'grade',
                label: 'Testing',
                internalId:'test'
            }
        ],
        translations: {
            "MENU_PACKAGES": 'Paquetes VIP',
            "MENU_COINS": 'Districoins',
            "MENU_TRANSACTIONS": "Transacciones"
        }
        
    }

    private vipData: VipData = {
        history: [
            {
                id          : 2,
                internalId  : "abc123",
                subject     : "TEsting",
                price       : 2.7 ,
                status      : 2,
                currency    : 'CLP',
                buy_at      : new Date(),
                orderId     : 'abc123'
            }
        ],
        packages: [
            {
                InternalID  : "abc1234",
                image       : "https://i.imgur.com/OpV8Gq9.png",
                description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius repudiandae, querat a test vitae ipsa?",
                prices      : {
                    CLP: 1000,
                    USD: 2.7
                },
                credits     : 100,
                limit: 1
            },
            {
                InternalID  : "free-test-package",
                image       : "https://i.imgur.com/OpV8Gq9.png",
                description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius repudiandae, querat a test vitae ipsa?",
                prices      : {
                    CLP: 0,
                    USD: 2.7
                },
                credits     : 100,
                globalLimit: 5
            },
            {
                InternalID  : "abc12346",
                image       : "https://i.imgur.com/OpV8Gq9.png",
                description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius repudiandae, querat a test vitae ipsa?",
                prices      : {
                    CLP: 1000,
                },
                credits     : 100 
            },
            {
                InternalID  : "abc12347",
                image       : "https://i.imgur.com/OpV8Gq9.png",
                description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius repudiandae, querat a test vitae ipsa?",
                prices      : {
                    USD: 1.7,
                },
                credits     : 100,
                limit: 2,
                globalLimit: 10
            },
        ],
        userData: {
            email: "",
            username: ""
        },
        payments: [
            "flow",
            "paypal",
            "mercadopago",
            "fintoc",
            'credits'
        ]
    }

    public paymentsMethods: PaymentMethod[] = [
        {
            id: 'flow',
            image: '/assets/payments/flow.png',
        },
        {
            id: 'paypal',
            image: 'https://i.imgur.com/4TjbsNh.png'
        },
        {
            id: 'mercadopago',
            image: '/assets/payments/mercadopago.png'
        },
        {
            id: 'fintoc',
            image: '/assets/fintoc.png'
        },
        {
            id: 'credits',
            image: '/assets/payments/credits.png'
        }
    ]

    constructor(private httpClient: HttpClient, private router: Router) {}

    public getAppSettings = () => this.appSettings  
    public getVipData = () => this.vipData
    public addViphistory = (vipHistory: VipHistory) => this.vipData.history.unshift(vipHistory)
    public updateStatus = (orderId: number, status: number) => {
        let vipPackage = this.vipData.history.findIndex(p => p.id == orderId)

        if(vipPackage >= 0){
            this.vipData.history[vipPackage].status = status
        }
    }
    public needCloseDialog = () => this.networkRequestCloseDialogs

    SetupNativeService() {
        if (!this.isServiceLoaded) {
            window.addEventListener('message', this.handleNativeEvent.bind(this))
            window.addEventListener('keyup', this.handleKeyboardEvent.bind(this))

            console.log('[PayFlow] ==> The UI has been loaded.');
            this.isServiceLoaded = true
        }
    }

    

    ///// Network Handler
    FetchData = async <T>(action: string, data: any, emulatedData?: any): Promise<Awaited<T> & { error: any; }> => await lastValueFrom(this.httpClient.post(`https://${this.resourceName}/` + action, JSON.stringify(data)).pipe(catchError(error => of((emulatedData) ? emulatedData : {error: "Server not response..."})))).finally(() => {setTimeout(() => {
        return (emulatedData) ? emulatedData : {error: "Server not response..."}
    }, 10000);})

    private async handleKeyboardEvent(event: KeyboardEvent) {
        /// EXAMPLE event.key
        if (event.key === "Escape") {
            // Do something
            // If you want 'close UI' just go to '/' route.
            // ex: router.navigate('/) 
        }
    }

    private handleNativeEvent(event: MessageEvent<any>) {
        console.log("MSG: ", event?.data?.action, event?.data);

        var eventMessage = event?.data;

        if (eventMessage.action !== undefined) {
            switch (eventMessage.action) {
                case NativeMessageType.OPEN_UI:
                    this.router.navigateByUrl('/cad/credits')
                    this.vipData = eventMessage.data
                    break;
                case NativeMessageType.CLOSE_UI:
                    this.router.navigateByUrl('/')
                    this.networkRequestCloseDialogs.next(true)
                    break;
                default:
                    console.log(`Event is invalid or event handler is missing for event message: ${event.data.message}`);
            }
        }
    }
}