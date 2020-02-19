import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 

@Component({
	selector: 'app-pages',
	templateUrl: './pages.component.html',
	styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

	descriptionEmpty : boolean = false;
	isopenAddPageModal : boolean = false;
	submitted : boolean = false;
	errorsArr : any ;
	isError : boolean = false;
	isalreadyEixst : boolean = false;
	isalreadyEixstErr : boolean = false;
	addPageForm : FormGroup;
	base_url : string = '';
	image_base_url : string = '';
	allpagesArray : any = [];
	pagesCount : any;
	isArrayLength : boolean = false;
	isopenEditPageModal : boolean = false;
	id : string = '';
	updatePageForm : FormGroup;

	constructor(
		private formBuilder : FormBuilder,
		private router : Router,
		public toastr : ToastrManager,
		private data_service : DataService,
		private http : HttpClient
		) {
		this.addPageForm = this.formBuilder.group({
			name: ['', Validators.required],
		});

		this.updatePageForm = this.formBuilder.group({
			name: ['', Validators.required],
			status: ['', Validators.required],
		});

		this.image_base_url = environment.image_base_url;
		this.base_url = environment.base_url;
	}

	ngOnInit() {
		if(sessionStorage.getItem("roleId") != '1'){
			this.router.navigate(['/dashboard']);
		}
		this.getAllpages();
	}

	getAllpages() {
		this.data_service.getAllpages().subscribe((response:any) =>{ 
			this.toastr.successToastr(response.message, 'Success!');
			this.allpagesArray = response.pagesArr;
			this.pagesCount = this.allpagesArray.length;
			if(this.pagesCount.length > 10 ) {
				this.isArrayLength  = true;
			}
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}

	openAddPageModal(){
		this.isopenAddPageModal = true;
	}

	get f() { return this.addPageForm.controls; }

	addPage(formValue){
		this.submitted = true;
		if(this.addPageForm.invalid) {
			return;
		} else {
			const input_data = {  
				"name": formValue.name, 
			}
			const formData = new FormData();
			formData.append('name', input_data.name);
			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'pages/add', formData, httpOptions).subscribe((response:any) => {
				if(response.error ==true) {
					this.toastr.errorToastr(response.message, 'Error!');
				} else {
					this.toastr.successToastr(response.message, 'Success!');
				}
				this.isopenAddPageModal = false;
				this.submitted = false;
				this.addPageForm.reset(); 
				this.getAllpages();

			},error=>{ 
				console.log('error', error);
			});
		}
	}
	closeModal(){
		this.isopenAddPageModal = false;
		this.submitted = false;     
		this.addPageForm.reset(); 
	}

	contentPerPage(page) {
		this.router.navigate(['/admin/page-content'], { queryParams: { pn : page.name, page: page.pageId } });  
	}

	editPageModal(page){
		//console.log('formValue', page);
		this.id = page.pageId;
		this.isopenEditPageModal = true;
		this.updatePageForm.patchValue({
			name : page.name,
			status : page.status
		});

	}

	get g() { return this.updatePageForm.controls; }

	updatePage(formValue) {
		
		this.submitted = true;
		if(this.updatePageForm.invalid) {
			return;
		}else{
			const input_data = {  
				"name": formValue.name, 
				"status": formValue.status, 
			}
			const formData = new FormData();
			formData.append('name', input_data.name);
			formData.append('status', input_data.status);
			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'pages/edit/'+this.id, formData, httpOptions).subscribe((response:any) => {
				if(response.error ==true) {
					this.toastr.errorToastr(response.message, 'Error!');
				} else {
					this.toastr.successToastr(response.message, 'Success!');
				}
				this.isopenEditPageModal = false;
				this.submitted = false;
				this.updatePageForm.reset(); 
				this.getAllpages();

			},error=>{ 
				console.log('error', error);
			});
		}
	}
	closeEditModal(){
		this.isopenEditPageModal = false;
		this.updatePageForm.reset();
	}
}


