import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'colive';


  constructor(
    private router: Router,
    private route: ActivatedRoute
    ) {

  }
  ngOnInit() {
    if(this.router.url == '/' || this.router.url == '/home'){
    //  console.log('this.router.url', this.router.url);
      let cc = window as any;
       cc.cookieconsent.initialise({
        palette: {
          popup: {
            background: 'black',
          },
          button: {
            background: "#ffe000",
            text: "#164969"

          }
        },
        theme: "classic",
        content: {
          message: 'By using our site, you acknowledge that you have read and understand our Privacy Policy, Terms & conditions, GDPR',
          dismiss: 'I read and understood',
          link: 'Learn more',
          href: location.origin+ "/privacy-policy" 
        }
      });
    }
  }

  onEdit(){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
}
