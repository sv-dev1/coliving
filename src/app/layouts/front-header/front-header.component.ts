import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-front-header',
  templateUrl: './front-header.component.html',
  styleUrls: ['./front-header.component.css']
})
export class FrontHeaderComponent implements OnInit {
  content : string = '';
  isfaq : boolean = false;
  isPrivacyPolicy : boolean = false;
  isHome : boolean = false;
  session_key : boolean = false;
  roleId : any ;
  constructor(
    private router: Router,
  	private route: ActivatedRoute,
    private service : DataService
    ) { }

  ngOnInit() {
         if(sessionStorage.getItem("auth_token") != undefined){
            this.session_key = true;
            this.roleId = sessionStorage.getItem('roleId');
        } 
  	    if(this.router.url == '/faq'){
	        this.isfaq = true;
	      }
        if(this.router.url == '/privacy-policy'){
           this.isPrivacyPolicy = true;
        }
        if(this.router.url == '/'){
           this.isHome = true;
        }
  }

  triggerScrollTo (pvarId) {
    this.service.changeMessage(pvarId);
    // window.scrollTo(0,document.body.scrollHeight);
  }

}
