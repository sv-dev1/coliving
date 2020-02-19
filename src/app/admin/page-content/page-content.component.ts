import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
	selector: 'app-page-content',
	templateUrl: './page-content.component.html',
	styleUrls: ['./page-content.component.css']
})
export class PageContentComponent implements OnInit {

	public Editor = ClassicEditor;
	pageContentForm : FormGroup;
	fileData : any;
	url : any;
	boolUrl : boolean = false;
	boolUserImage : boolean = false;
	image_base_url : any;
	image_url : any;
	base_url : any;
	submitted = false;
	descriptionEmpty : boolean = false;
	isError : boolean = false; 
	errorsArr : boolean = false; 
	pageId : string = '';
	imageEmpty : boolean = false;
	pageContent :  any = [];
    pageContentCount :  any;
    isArrayLength : boolean = false;
    pageName : string = '';

	constructor(
		private formBuilder:FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient
		) { 
		this.pageContentForm = this.formBuilder.group({
			title: [''],
			subtitle: [''],
			image: [''],
			description: [''],
			file:[''],
		});
		this.base_url = environment.base_url;
		this.image_base_url = environment.image_base_url;
	}

	ngOnInit() {
		this.pageId = this.route.snapshot.queryParamMap.get('page');
		this.pageName = this.route.snapshot.queryParamMap.get('pn');
		this.getPageContent(this.pageId);
	}

	getPageContent(pageId) {
		this.data_service.getPageContent(pageId).subscribe((response:any) =>{ 
			//console.log('response', response);
			//this.toastr.successToastr(response.message, 'Success!');
			this.pageContent = response.pagesArr;
			this.pageContentCount = this.pageContent.length;
			if(this.pageContentCount.length > 10 ) {
				this.isArrayLength  = true;
			}
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	onSelectFile(event) {
		this.fileData = event.target.files[0];
		if(this.fileData != '' || this.fileData != undefined || this.fileData != null) {
			this.imageEmpty = false;
		}
		this.preview();
		this.pageContentForm.patchValue({
			'image' :  this.fileData
		});
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
			this.boolUrl = true;
			this.boolUserImage =false;
		}
	}
	get f() { return this.pageContentForm.controls; }

	addContent(formValue) {
		console.log('formValue', formValue);
		this.submitted = true;
		if(formValue.description == ""){
			this.descriptionEmpty = true;
		}
		if(formValue.image  == ""){
			this.imageEmpty = true;
		}
		if(this.pageContentForm.invalid) {
			return;
		}else{
			
			const formData = new FormData();
			formData.append('title', formValue.title);
			formData.append('subtitle', formValue.subtitle);		   
			formData.append('image', this.fileData);
			formData.append('content', formValue.description);

			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'pages/addcontent/'+this.pageId, formData, httpOptions).subscribe((response:any) => {
				console.log('response', response);
				this.toastr.successToastr(response.message,'Success');
				this.submitted = false;
			},error =>{
				this.isError = true;
				console.log('errors',error); 
				this.toastr.errorToastr(error.error.status,'Error');
				this.errorsArr = error.error;
			});
		}
	}
}
