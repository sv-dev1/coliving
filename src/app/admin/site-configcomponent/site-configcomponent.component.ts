import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
	selector: 'app-site-configcomponent',
	templateUrl: './site-configcomponent.component.html',
	styleUrls: ['./site-configcomponent.component.css']
})
export class SiteConfigcomponentComponent implements OnInit {

	addressEmpty: boolean  = false;
	public Editor = ClassicEditor;
	siteConfigForm : FormGroup;
	submitted : boolean = false;
	isError  : boolean = false;
	errorsArr : boolean = false;
    messageDigit : boolean = false;
    current_country : string = "";
    ip_address : string = "";

	constructor(
		private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient
		) { 
		this.siteConfigForm = this.formBuilder.group({
			email: ['', Validators.required],
			phoneNo: ['', Validators.required],
			address: ['', Validators.required]
		});
	}

	ngOnInit() {
	    if(sessionStorage.getItem("roleId") != '1'){
			this.router.navigate(['/dashboard']);
		}
		this.getCurrentIP();
	}
    getCurrentIP(){
	      this.http.get('https://jsonip.com').subscribe( data => {
	      this.ip_address = data['ip'];
	      this.getCurrentLoaction();
	    })
    }
    getCurrentLoaction(){
		this.data_service.currentLocation(this.ip_address).subscribe(response => { 
		this.current_country = response['country'].toLowerCase();

        },error => {
		console.log(error);
		})
    }

	get f() { return this.siteConfigForm.controls; }

	siteConfig(formValue) {
		this.submitted = true;
		if(formValue.address == ""){
			this.addressEmpty = true;
		}
		if(this.siteConfigForm.invalid) {
			return;
		}else{
			const input = {  
				"question": formValue.category, 
				"description": formValue.description,   
			}
			this.data_service.addFaq(input).subscribe((response:any)=> { 
				this.toastr.successToastr(response.message,'Success');
				this.submitted = false;         
				this.siteConfigForm.reset();
			},error =>{
				this.isError = true; 
				this.errorsArr = error.error;
			});
		}
	}
}
