import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, of, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NativeMessageType } from '../interfaces/NativeMessageType';
import { Settings } from '../interfaces/Settings.interface';


@Injectable({
    providedIn: 'root'
})

export class NativeService {

    private isServiceLoaded = false
    private resourceName = ""

    private appSettings: Settings = {
        language: 'en',
        refreshInterval: 5000,
        asAdmin: true,

        scriptName: 'nex_advReports',
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
            "REPORT_COMMAND_DESCRIPTION": "Open report UI",
            "REPORT_DEFAULT_CHAT": "Chat initialized between Staff & Member",
            "CREATED_AT": "Created At",
            "UPDATED_AT": "Updated At",
            "STATUS": "Status",
            "SUBJECT": "Subject",
            "CATEGORY": "Category",
            "DESCRIPTION": "Description",
            "VIEW_REPORT": "Viewing report",
            "STATUS_WAITING": "Waiting",
            "STATUS_COMPLETED": "Completed",
            "STATUS_OPEN": "Open",
            "FETCHING_REPORTS": "Fetching Reports",
            "FETCHING_STATS": "Fetching Stats",
            "FETCHING_NO_DATA": "No data available",
            "REPORT_SYSTEM": "Report System",
            "MENU_NEW_REPORT": "NEW REPORT",
            "MENU_VIEW_REPORTS": "View Reports",
            "MENU_STATS": "Stats",
            "NEW_REPORT_TITLE": "OPEN REPORT",
            "NEW_REPORT_SUBJECT": "Subject",
            "NEW_REPORT_CATEGORY": "Category",
            "NEW_REPORT_DESCRIPTION": "Description",
            "NEW_REPORT_SUBMIT": "SUBMIT REPORT",
            "VIEW_REPORT_REPORTER": "Reporter",
            "VIEW_REPORT_ASSIGNED": "Staff Assigned",
            "VIEW_REPORT_TAKE_TICKET": 'Take Ticket',
            "VIEW_REPORT_STEAMNAME": "Steamname",
            "VIEW_REPORT_STAFFACTIONS": "Staff Actions",
            "VIEW_REPORT_SESSIONSLOG": "Sessions Logs",
            "VIEW_REPORT_DEATRHSLOG": "Deaths Logs",
            "CHAT_SYSTEM_NAME": "System",
            "CHAT_SYSTEM_FIRST_MESSAGE": "This is a section to write directly with the staff, please be respectful and have a civil conversation.",
            "TOAST_STATUS_UPDATE": "Status Updated!",
            "REPORT_CREATED_NOTIFY_USER": "Report #%s Sended!",
            "REPORT_CRAETE_NOTIFY_ADMIN": "New report received: ID: %s | Subject: %s | Author: %s (%s)",
        }
        
    }

    constructor(private httpClient: HttpClient) {}

    public getAppSettings = () => this.appSettings  

    SetupNativeService() {
        if (!this.isServiceLoaded) {
            window.addEventListener('message', this.handleNativeEvent.bind(this))
            window.addEventListener('keyup', this.handleKeyboardEvent.bind(this))

            console.log('[Boilerplate] ==> The UI has been loaded.');
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
                case NativeMessageType.SET_RESOURCE_NAME:
                    this.resourceName = eventMessage.data.resourceName;
                    break;
                default:
                    console.log(`Event is invalid or event handler is missing for event message: ${event.data.message}`);
            }
        }
    }
}