import { Component } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { NativeService } from 'src/app/shared/services/native.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
  title: string = "VIP"
  requestLoading: boolean = false
  activeLinkIndex = -1

  navLinks = [
    {
      link: '/cad/packages',
      userTitle: 'MENU_NEW_REPORT',
      icon: 'add',
      index: 0
    },
    {
      link: '/cad/transactions',
      userTitle: 'MENU_VIEW_REPORTS_AS_USER',
      icon: 'view_timeline',
      index: 1
    },
  ]

  constructor(private router: Router, public nativeService: NativeService){
    router.events.subscribe((e: Event) => {
      if(e instanceof NavigationStart){
        let pageId = this.navLinks.find(tab => tab.link === e.url)
        if(pageId)
          this.activeLinkIndex = this.navLinks.indexOf(pageId)
        else
          this.activeLinkIndex = 0
      }
    })

  }

  async closeUI(){
    const response = await this.nativeService.FetchData('closeUI', {}) 
    if (!response.error)
      this.goToURL('/')
  }

  goToURL(url?: string) {
    this.router.navigate([url || '/cad/transactions']) 
  }
}
