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
	updateSectionContentForm : FormGroup;
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
	isSectionContentModal : boolean = false;
	isImage : boolean = false;
	urls : any = [];


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

		this.updateSectionContentForm = this.formBuilder.group({
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
			this.pageContent = response.pagesArr.sections;
			this.pageContentCount = this.pageContent.length;
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
			for (let file of files) {
				let reader = new FileReader();
				reader.onload = (e: any) => {
					this.urls.push(e.target.result);
				}
				reader.readAsDataURL(file);
			}
		}
	}

	onSelectFile(event) {
		console.log('event', event);
		this.fileData = event.target.files;
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
		this.submitted = true;
		if(formValue.description == ""){
			this.descriptionEmpty = true;
		}
		if(formValue.image  == ""){
			this.imageEmpty = true;
		}
		if(this.pageContentForm.invalid) {
			return;
		} else {
			const formData = new FormData();
			formData.append('title', formValue.title);
			formData.append('subtitle', formValue.subtitle);		   
			formData.append('image', this.urls);
			formData.append('content', formValue.description);

			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'pages/addcontent/'+this.pageId, formData, httpOptions).subscribe((response:any) => {
				this.toastr.successToastr(response.message,'Success');
				this.submitted = false;
				this.getPageContent(this.pageId);
				this.pageContentForm.reset();
				this.url = '';
			},error =>{
				this.isError = true;
				this.toastr.errorToastr(error.error.status,'Error');
				this.errorsArr = error.error;
			});
		}
	}

	editPageSectionContentModal(page) {

		this.isSectionContentModal = true;
		this.image_url = this.image_base_url+''+page.contentId;
		this.isImage = true;
		this.updateSectionContentForm.patchValue({
			title : page.title,
			subtitle : page.subtitle,
			description : page.content,
			image:[''],
		});
	}

	closeEditModal() {

		this.isSectionContentModal = false;
		this.updateSectionContentForm.reset(); 
	}
	get g() { return this.updateSectionContentForm.controls; }

	updateContent(formValue) {
		this.submitted = true;
		if(formValue.description == ""){
			this.descriptionEmpty = true;
		}
		if(formValue.image  == ""){
			this.imageEmpty = true;
		}
		if(this.updateSectionContentForm.invalid) {
			return;
		} else {
			const formData = new FormData();
			formData.append('title', formValue.title);
			formData.append('subtitle', formValue.subtitle);		   
			formData.append('image', this.urls);
			formData.append('content', formValue.description);

			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'pages/addcontent/'+this.pageId, formData, httpOptions).subscribe((response:any) => {
				this.toastr.successToastr(response.message,'Success');
				this.submitted = false;
				this.getPageContent(this.pageId);
				this.pageContentForm.reset();
				this.url = '';
			},error =>{
				this.isError = true;
				this.toastr.errorToastr(error.error.status,'Error');
				this.errorsArr = error.error;
			});
		}
	}

}
