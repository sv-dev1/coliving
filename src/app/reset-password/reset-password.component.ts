import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import { ActivatedRoute } from '@angular/router';
import { MustMatch } from '../helpers/must-match.validator';


@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

	resetPasswordForm: FormGroup;
	submitted = false; 
	fagree =false;
	msg = ''; 
	isError : boolean = false;
	isSuccess : boolean = false;
	errorsArr:any = []; 
	returnUrl: string;
	res:any = [];
    user_id:string ='';
    token:any;

	constructor(
		private formBuilder:FormBuilder,	
		private router: Router,
		private data_service : DataService,
		public toastr: ToastrManager,
		private http : HttpClient,
		private route: ActivatedRoute
		) { 

		this.resetPasswordForm = this.formBuilder.group({
			password: ['', [Validators.required, Validators.minLength(8)]],
			confPassword:  ['', Validators.required]
           }, {
            validator: MustMatch('password', 'confPassword')  
		}); 
	}
	ngOnInit() {
		const token: string = this.route.snapshot.queryParamMap.get('t');
		if(token) {
			this.verfiyToken(token);
			this.token = token;
		}
	}
	verfiyToken(token){
		if(token) {
			this.data_service.verifyToken(token).subscribe((response:any) =>{
				this.res = JSON.stringify(response, undefined, 2);
				 //console.log(response);
				if(response.userId !='') {
					   this.user_id = response.userId;
				} 
				this.isError = false;
			}, error =>{ 
				
				this.isError = true; 
				this.toastr.errorToastr(error.error.errors.message,'Error');
				this.router.navigate(['/login']);

			})
		}
	}
	get f() {  
		return this.resetPasswordForm.controls; 
	}
	resetPassword(formValue){
		this.submitted = true;
		if (this.resetPasswordForm.invalid) {
			return;
		}else{ 
		      const input_data = { 
			        "password" : formValue.password,
			        "password2" : formValue.confPassword, 
	                "user_id": this.user_id,
	                "token" : this.token
		      }		
		       this.data_service.resetPassword(input_data).subscribe((response:any) =>{
		       // console.log('asdasdsadsa',JSON.stringify(response, undefined, 2));
		        console.log('token after login', response);
		        this.res = JSON.stringify(response, undefined, 2); 
		        this.toastr.successToastr(response.message,'Success');
		        this.router.navigate(['/login']);  
		        this.isError = false;
		      }, error =>{ 
		        this.isError = true; 
		        this.toastr.errorToastr('Invalid Credentials','Error');
		       
		      })
		}
	}
   checkPasswords(group: FormGroup) { // here we have the 'passwords' group
	  let pass = group.get('password').value;
	  let confirmPass = group.get('confirmPass').value;

	  return pass === confirmPass ? null : { notSame: true }     
	}
}
