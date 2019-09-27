import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 


@Component({
	selector: 'app-my-account',
	templateUrl: './my-account.component.html',
	styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
	msg = ''; 
	isError : boolean = false;
	isSuccess : boolean = false;
	errorsArr:any = []; 
	newArray : any = [];
	profileData : any = [];

	updateProfileForm: FormGroup;
	image_base_url :any;
	image_url:any;
	submitted = false;
	base_url :any;
	fileData:any;
	url:any;
	userDataArr:any;
	email:any;

	constructor(
		private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient,
		) {   
		this.updateProfileForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', Validators.required],
			phoneNumber: ['', Validators.required],
			postalCode: ['', [Validators.required, Validators.maxLength(6)]],
			country: ['', Validators.required],
			address: ['', Validators.required],
			image:[''],
			file:['']
		});
		this.base_url = environment.base_url;
		this.image_base_url = environment.image_base_url;
	}

	ngOnInit() {
		this.getUserData();
	}
	getUserData(){ 
		console.log('All users gets list out under this function');

		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
       // console.log('token',token);
		this.http.get(this.base_url+'user/profile', { headers: headers }).subscribe((response: any) => {
			this.userDataArr = response.users[0]; 
			console.log('sfsfdf', response.users[0]);
			this.image_url = this.image_base_url+''+this.userDataArr.userId;
			this.updateProfileForm.patchValue({
				firstName : this.userDataArr.firstName,
				lastName : this.userDataArr.lastName,
				email : this.userDataArr.email,
				phoneNumber : this.userDataArr.phoneNo,
				postalCode : this.userDataArr.postalCode,
				address : this.userDataArr.address,
				country : this.userDataArr.country,
			});
			
			this.email = this.userDataArr.email;	
			//console.log('image_url', this.image_url);	
		},error=>{ 
			console.log("ERROR");
			console.log(error.error);
		});  
	}
	get f() {  
		return this.updateProfileForm.controls; 
	}
	onSelectFile(event) {
		this.fileData = event.target.files[0];
		this.preview();
	}
	preview() {
		var mimeType = this.fileData.type;
		if (mimeType.match(/image\/*/) == null) {
			return;
		}
		var reader = new FileReader();      
		reader.readAsDataURL(this.fileData); 
		reader.onload = (_event) => { 
			this.url = reader.result; 
		}
	}
	updateProfile(form){
		console.log('ffsdf ',form);
		this.submitted = true;  
		if (this.updateProfileForm.invalid) {
			return;
		} else {  

			const input_data = { 
				"first_name" : form.firstName, 
				"last_name" : form.lastName,
				"email" : form.email,
				"upload_photo" : this.fileData,
				"phoneNo" : form.phoneNumber,
				"postalCode" : form.postalCode,
				"country" : form.country,
				"address" : form.address,
			} 
			//console.log('input_data',input_data);  
			const formData = new FormData();
			formData.append('firstName', input_data.first_name);
			formData.append('lastName', input_data.last_name);
			formData.append('email', input_data.email);	 	   
			formData.append('upload_photo', this.fileData);
			formData.append('phoneNo', input_data.phoneNo);
			formData.append('postal_code', input_data.postalCode);   
			formData.append('country', input_data.country);
			formData.append('address', input_data.address); 
			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.put(this.base_url+'user/profile', formData, httpOptions).subscribe((response:any) => {
				//console.log('response response',response); 
				this.toastr.successToastr('Profile Updated successfully.', 'Success!');			
				this.updateProfileForm.reset();
				this.router.navigate(['/dashboard']);
				this.isError = false;
				this.isSuccess = true;  	
			},error=>{ 
				this.toastr.errorToastr(error.error, 'Error!');
			});   
		}
	}
}
