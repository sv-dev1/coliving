import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  session_key : boolean = false;
  msg = ''; 
  isError : boolean = false;
  isSuccess : boolean = false;
  errorsArr:any = []; 
  newArray : any = [];
  profileData : any = [];

  constructor(
         private router: Router,
         public toastr: ToastrManager,
         private data_service : DataService,
  	) { }

  ngOnInit() {
  	  if(sessionStorage.getItem("auth_token") != undefined){
	  	    this.session_key = true;
	    } else if(sessionStorage.getItem("auth_token") == undefined){
           this.router.navigate(['/']);  
      } 
    this.getUserData();  
  }

  systemLogout($event){ 
  	if(sessionStorage.getItem("auth_token") != undefined){
      this.session_key = false;
  	  sessionStorage.removeItem("auth_token");
      this.toastr.successToastr('Logout Successfully!','Success',);
  		this.router.navigate(['']);
  	}
  }
  getUserData() {

     this.data_service.getUserData().subscribe((response:any) =>{   
        this.newArray = this.newArray.concat(response.users[0]);
        this.profileData = this.newArray;
        //this.router.navigate(['/dashboard']);  
        this.isError = false;    
      }, error =>{ 
        this.isError = true; 
        this.errorsArr = error.error;
      })

  }
}
