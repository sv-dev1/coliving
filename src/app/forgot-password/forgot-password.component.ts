import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 


@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

	forgotPasswordForm: FormGroup;
	submitted = false; 
	fagree =false;
	msg = ''; 
	isError : boolean = false;
	isSuccess : boolean = false;
	errorsArr:any = []; 
	returnUrl: string;
	res:any = [];

	constructor(
		private formBuilder:FormBuilder,	
		private router: Router,
		private data_service : DataService,
		public toastr: ToastrManager,
		private http : HttpClient,
		) { 
		this.forgotPasswordForm = this.formBuilder.group({
			username: ['', [Validators.required]],	      
		});  
	}

	ngOnInit() {
	}
	navigate(){
		this.router.navigate(['/login']);
	}

	get f() { return this.forgotPasswordForm.controls; }
	
	forgotPassword(formValue){
		this.submitted = true;
		if (this.forgotPasswordForm.invalid) {
			return;
		} else {
			const input_data = { 
				"username" : formValue.username, 		
			}
			this.data_service.forgetPassword(input_data).subscribe((response:any) =>{
				//console.log('response on component', response.message);
				this.res = JSON.stringify(response, undefined, 2); 
				this.toastr.successToastr(response.message,'Success');
				this.router.navigate(['/login']);  
				this.isError = false;
			}, error =>{ 
				//console.log('errrror',error);
				this.isError = true; 
				this.toastr.errorToastr('response.message','Error');
		
			})
		}
	}
}
