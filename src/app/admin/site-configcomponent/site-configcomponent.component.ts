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
    settingsArray : any = [];
    base_url : any;
    image_base_url : any;
	image_url : any;
	isImage : boolean = false;
    images: any = [];
    urls: any = [];

	constructor(
		private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient
		) { 
		this.siteConfigForm = this.formBuilder.group({
			email: ['', Validators.required],
			address: ['', Validators.required],
			copyright: ['', Validators.required],
			fbsociallink : [''],
			instasociallink : [''],
			linksociallink: [''],
			twittersociallink: [''],
			image: [''],
		});
		this.base_url = environment.base_url;
		this.image_base_url = environment.image_base_url;
	}

	ngOnInit() {
	    if(sessionStorage.getItem("roleId") != '1'){
			this.router.navigate(['/dashboard']);
		}
		this.getCurrentIP();
		this.getSettings();
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

    getSettings() {
		this.data_service.getSettings().subscribe((response:any) =>{   
 		this.settingsArray = response.settings[0];
 		this.image_url = this.settingsArray.logo;
 	
		this.isImage = true;
 		this.siteConfigForm.patchValue({
	     		email : this.settingsArray.contactemail,
	            address : this.settingsArray.address,
	            copyright : this.settingsArray.copyright,
	            fbsociallink : this.settingsArray.fbsociallink,
	     		instasociallink : this.settingsArray.instasociallink,
	            linksociallink : this.settingsArray.linksociallink,
	            twittersociallink : this.settingsArray.twittersociallink,
     	});
 		this.isError = false;    
     	}, error =>{ 
     		this.isError = true; 
     		this.errorsArr = error.error;
     	})
    }

   
	detectFiles(event) {
		
		let files = event.target.files;
		if (files) {
			this.isImage = true;
			let i = 0;
			for (let file of files) {
				this.images.push(file);
				let reader = new FileReader();
				reader.onload = (e: any) => {
					this.urls.push(e.target.result);
				}
				reader.readAsDataURL(file);
				i++;
			} 
		}
	}

	get f() { return this.siteConfigForm.controls; }

	siteConfig(formValue) {
		this.submitted = true;
		/*if(formValue.address == ""){
			this.addressEmpty = true;
		}*/
		console.log('this.images', this.images);
		if(this.siteConfigForm.invalid) {
			return;
		}else{
			const formData = new FormData();
			formData.append('contactemail', formValue.email);
			formData.append('address', formValue.address);		
			formData.append('copyright', formValue.copyright);
			formData.append('fbsociallink', formValue.fbsociallink);		   
			formData.append('instasociallink', formValue.instasociallink);
			formData.append('linksociallink', formValue.linksociallink);		   
			formData.append('twittersociallink', formValue.twittersociallink);
			formData.append('logo', this.images);
			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'websetting/update/'+this.settingsArray.webSID, formData, httpOptions).subscribe((response:any) => {
				this.toastr.successToastr(response.message,'Success');
				this.submitted = false;
				this.getSettings();
			},error =>{
				this.isError = true;
				this.toastr.errorToastr(error.error.status,'Error');
				this.errorsArr = error.error;
			});
		}
	}
}
	  