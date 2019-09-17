import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 session_key : boolean = false;
  constructor(
         private router: Router,
         public toastr: ToastrManager
  	) { }

  ngOnInit() {
  	  if(sessionStorage.getItem("auth_token") != undefined){
	  	this.session_key = true;
	  } 
  }

  systemLogout($event){ 
  	if(sessionStorage.getItem("auth_token") != undefined){
      this.session_key = false;
  	  sessionStorage.removeItem("auth_token");
      this.toastr.successToastr('Logout Successfully!','Success',);
  		this.router.navigate(['']);
  	}
  }

}
