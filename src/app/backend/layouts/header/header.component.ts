import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';

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
  userDataArr:any =[];
  image_url: string = "";
  image_base_url:any;
  base_url:any;

  constructor(
        private router: Router,
        public toastr: ToastrManager,
        private data_service : DataService,
        private http : HttpClient,
    ) {
        this.base_url = environment.base_url;
        this.image_base_url = environment.image_base_url;
     }

  ngOnInit() {
    if(sessionStorage.getItem("auth_token") != undefined){
      this.session_key = true;
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
  getUserData(){ 
   
    let token; 
    if(sessionStorage.getItem("auth_token")!=undefined){
      token = sessionStorage.getItem("auth_token"); 
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', token);
    // console.log('token',token);
     this.http.get(this.base_url+'user/profile', { headers: headers }).subscribe((response: any) => {
      this.userDataArr = response.users[0]; 
      this.image_url = this.image_base_url+''+this.userDataArr.userId;
    },error=>{ 
      console.log("ERROR");
      console.log(error.error);
    });  
  }
}
