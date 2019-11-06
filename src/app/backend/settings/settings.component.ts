import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	base_url :any;
	userInfo:any;
	color = 'accent';
    checked :false;
    on_off:string='';
    message:string;


  constructor(
        private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient,
  ) { 
    this.base_url = environment.base_url;
  }

  ngOnInit() {
    this.getUserData();
  }

	changed(event){		
		    if(event){
		    	 let notification;
		    	 if(event.checked == true) {
			            notification = 1;
					} else if(event.checked == false) {
			            notification = 0;
				 }
				 const input = {
                        "notification":notification
				  }
		         this.data_service.setNotification(input).subscribe((response:any)=> { 
	                this.toastr.successToastr(response.message,'Success'); 
		        },error =>{
		          this.isError = true; 
		          this.errorsArr = error.error;
		        });
		 }
	}
	 getUserData(){ 
   
	    let token; 
	    if(sessionStorage.getItem("auth_token")!=undefined){
	      token = sessionStorage.getItem("auth_token"); 
	    }
	    let headers = new HttpHeaders();
	    headers = headers.set('Authorization', token);
	       this.http.get(this.base_url+'user/profile', { headers: headers }).subscribe((response: any) => {
	         if(response.users[0].setting.notification ==1) {
                 this.on_off = true;
                 this.message = 'Notification On';
	         } else if(response.users[0].setting.notification ==0) {
	         	 this.on_off = false;
	         	 this.message = 'Notification Off';
	         }

	    },error=>{ 
	      this.isError = true; 
	      this.errorsArr = error.error;
	    });  
    }
	
}
