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

	base_url : any;
	userInfo : any;
	color = 'accent';
	checked : boolean = false;
	on_off : boolean = false;
	on_off1 : boolean = false;
	on_off2 : boolean = false;
	on_off3 : boolean = false;
	on_off4 : boolean = false;
	message :any;
	isError : any;
	errorsArr : any;
    notificationForm : FormGroup;

	constructor(
		private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient,
		) { 
		  this.base_url = environment.base_url;
		  this.notificationForm = this.formBuilder.group({
		 	   notification : [''],
		 	   b_notification : [''],
		 	   cm_notification : [''],
		 	   g_notification : [''],
		 	   hcs_notification : ['']
		  });
	}

	ngOnInit() {
		this.getUserData();
		 if(sessionStorage.getItem("roleId") == '1' || sessionStorage.getItem("roleId") == '3' || sessionStorage.getItem("roleId") == '4'){
		      this.router.navigate(['/']);
		 }
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
				"notification":notification,
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
			console.log(response);
			if(response.users[0].setting.notification == 1) {
				this.on_off = true;
			} else if(response.users[0].setting.notification == 0) {
				this.on_off = false;
			}
          
			if(response.users[0].setting.b_notification ==1) {
				this.on_off1 = true;	
			} else if(response.users[0].setting.b_notification ==0) {
				this.on_off1 = false;	
			}

			if(response.users[0].setting.cm_notification ==1) {
				this.on_off2 = true;	
			} else if(response.users[0].setting.cm_notification ==0) {
				this.on_off2 = false;	
			}

			if(response.users[0].setting.g_notification ==1) {
				this.on_off3 = true;	
			} else if(response.users[0].setting.g_notification ==0) {
				this.on_off3 = false;	
			}

			if(response.users[0].setting.hcs_notification ==1) {
				this.on_off4 = true;	
			} else if(response.users[0].setting.hcs_notification ==0) {
				this.on_off4 = false;	
			}
			
			this.notificationForm.patchValue({
				'notification': this.on_off,
				'b_notification': this.on_off1,
				'cm_notification': this.on_off2,
                'g_notification': this.on_off3,
                'hcs_notification': this.on_off4,
			})

		},error=>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		});  
	}

	updateNotifications() {
            let notification;
            let b_notification;
            let cm_notification;
            let g_notification;
            let hcs_notification;
           	
			if(this.notificationForm.value['notification'] == true) {
				notification = 1;
			} else if(this.notificationForm.value['notification']== false) {
				notification = 0;
			}

			if(this.notificationForm.value['b_notification'] == true) {
				b_notification = 1;
			} else if(this.notificationForm.value['b_notification'] == false) {
				b_notification = 0;
			}

		    if(this.notificationForm.value['cm_notification'] == true) {
				cm_notification = 1;
			} else if(this.notificationForm.value['cm_notification'] == false) {
				cm_notification = 0;
			}

			if(this.notificationForm.value['g_notification'] == true) {
				g_notification = 1;
			} else if(this.notificationForm.value['g_notification'] == false) {
				g_notification = 0;
			}

			if(this.notificationForm.value['hcs_notification'] == true) {
				hcs_notification = 1;
			} else if(this.notificationForm.value['hcs_notification'] == false) {
				hcs_notification = 0;
			}

			const input = {
				 "notification" : notification ,
		 	     "b_notification" : b_notification,
		 	     "cm_notification" : cm_notification ,
		 	     "g_notification" : g_notification,
		 	     "hcs_notification" : hcs_notification
			}
			
			this.data_service.setNotification(input).subscribe((response:any)=> { 
				this.toastr.successToastr(response.message,'Success'); 
			},error =>{
				this.isError = true; 
				this.errorsArr = error.error;
			});
	}
	
}
