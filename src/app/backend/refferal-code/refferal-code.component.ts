import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 

@Component({
	selector: 'app-refferal-code',
	templateUrl: './refferal-code.component.html',
	styleUrls: ['./refferal-code.component.css']
})
export class RefferalCodeComponent implements OnInit {
	userDataArr:any;
	base_url :any;
	referralCodeForm: FormGroup;

	constructor(
		private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient
		) {
		this.referralCodeForm = this.formBuilder.group({
			referralCode: [''],
		});
		this.base_url = environment.base_url;
	}

	ngOnInit() {
		this.getUserData();
	}
	getUserData(){ 
		let token; 
		if(sessionStorage.getItem("auth_token")!=undefined){
			token = sessionStorage.getItem("auth_token"); 
		}
		let headers = new HttpHeaders();
		headers = headers.set('Authorization', token);
		this.http.get(this.base_url+'user/profile', { headers: headers }).subscribe((response: any) => {
			this.userDataArr = response.users[0]; 
			this.referralCodeForm.patchValue({
				referralCode : location.origin+'/'+'sign-up?rc='+this.userDataArr.ref_code,
			});	
		},error=>{ 
			console.log("ERROR");
			console.log(error.error);
		});  
	}
	copyMessage(inputElement){
		 inputElement.select();
	     document.execCommand('copy');
	     inputElement.setSelectionRange(0, 0)
	     this.toastr.successToastr('Referral Link copied successfully!', 'Success!');
	}
}
