import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';

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
  constructor(private router: Router,
  	private route: ActivatedRoute) { }

  ngOnInit() {
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

}