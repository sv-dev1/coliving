import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
	selector: 'app-app-dwonload-page',
	templateUrl: './app-dwonload-page.component.html',
	styleUrls: ['./app-dwonload-page.component.css']
})
export class AppDwonloadPageComponent implements OnInit {

	questionareform:FormGroup;
	isEmailModal :boolean = false;
	submitted : boolean = false; 
	isError : boolean = false;
	isSuccess : boolean = false;
	errorsArr:any = []; 
	referralCode : any;
	downloadUrl : string = '';
	openFileDownloadModal: boolean = false;

	constructor(
		private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient,
		private route: ActivatedRoute
		) { 
		this.questionareform = this.formBuilder.group({
			partying: ['', Validators.required],
			alcohol: ['', Validators.required],
			smoking: ['', Validators.required],
			apartment_clean_importance: ['', Validators.required],
			apartment_party: ['', Validators.required],
			music: ['', Validators.required],
			social_account: ['', Validators.required],
			religion: ['', Validators.required],
			email: ['', Validators.required],
			ref_code: ['', Validators.required]
		});
	}

	ngOnInit() {
		  const referralCode: string = this.route.snapshot.queryParamMap.get('rc');
		  console.log(referralCode);
			    if(referralCode) {
			      this.questionareform.patchValue({
			        ref_code : referralCode,
			    });  
		   }
	}

	openEmailModal() {
		this.isEmailModal = true;
	}

	get wf() { return this.questionareform.controls; }
	
	questionareSubmit(){
        
		this.submitted = true;
		if(this.questionareform.value['ref_code'] == undefined || this.questionareform.value['ref_code'] ==null) {
			console.log('first');
			this.toastr.errorToastr('Missing referral code.', 'Error!');
			this.router.navigate(['/login']); 
			return;
		}
		if(this.questionareform.invalid) {
			return;
		}else{
			
			const input_data = {     
				"email" : this.questionareform.value['email'],
				"alcohol" : this.questionareform.value['alcohol'],
				"partying" : this.questionareform.value['partying'],
				"smoking" : this.questionareform.value['smoking'],
				"apartment_clean_importance" : this.questionareform.value['apartment_clean_importance'],
				"apartment_party" : this.questionareform.value['apartment_party'],
				"music" : this.questionareform.value['music'],
				"social_account" : this.questionareform.value['social_account'],
				"religion" : this.questionareform.value['religion'],
				"ref_code" : this.questionareform.value['ref_code']
			}
			this.data_service.apiRegister(input_data).subscribe((response:any)=> { 
				this.toastr.successToastr(response.message, 'Success!');
				this.submitted = false;
                this.questionareform.reset();
                this.openFileDownloadModal = true;

			},error =>{
				this.isError = true; 
				this.errorsArr = error.error;

			});
		}
	}
	closeModal() {
		this.openFileDownloadModal = false;
	}
}


