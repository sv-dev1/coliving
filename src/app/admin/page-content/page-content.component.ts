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
	contentId : string = '';
	images : any = [];
	imagesArray : any = [];
	isPreviousimage : boolean = false;
	isShowRelatedimages : boolean = false;
	imagesCount: any;
	p: any;
	indexNumber : any=  [];
	isDisabled : boolean = false;
	isNullPreviousimage : boolean = false;
    title : string = '';
    deleteMessage : string = '';
    isSuccess : boolean = false;

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
			sectionIndex:[''],
			file:[''],
		});
		this.updateSectionContentForm = this.formBuilder.group({
			title: [''],
			subtitle: [''],
			image: [''],
			description: [''],
			sectionIndex:[''],
			file:[''],
		});
		this.base_url = environment.base_url;
		this.image_base_url = environment.image_base_url;
	}

	ngOnInit() {
		this.pageId = this.route.snapshot.queryParamMap.get('page');
		this.pageName = this.route.snapshot.queryParamMap.get('pn');
		this.getPageContent(this.pageId);
		for (var i = 1; i <= 22; i++){
            this.indexNumber.push(i);
		}
		  if(sessionStorage.getItem("roleId") != '1' ){
			       this.router.navigate(['/']);
		    }
	}

	getPageContent(pageId) {
		this.data_service.getPageContent(pageId).subscribe((response:any) =>{ 
			this.pageContent = response.pagesArr.sections;
			this.pageContentCount = this.pageContent.length;
			if(this.pageContentCount > 10) {
				this.isArrayLength = true;
			}
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

	get f() { return this.pageContentForm.controls; }

	addContent(formValue) {
		this.submitted = true;
		this.isDisabled = true;
			if(this.pageContentForm.invalid) {
				return;
			}
			else {
				const formData = new FormData();
				formData.append('title', formValue.title);
				formData.append('subtitle', formValue.subtitle);
				if(this.images){
					this.images.forEach(obj =>{
						formData.append('image',obj );
					});
				}			
				formData.append('content', formValue.description);
				formData.append('sectionIndex', formValue.sectionIndex);

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
					this.isImage = false;
					this.urls = '';
					this.isDisabled = false;
				},error =>{
					this.isError = true;
					this.toastr.errorToastr(error.error.status,'Error');
					this.errorsArr = error.error;
					this.isDisabled = false;
				});
			}
		}

		editPageSectionContentModal(page) {

			this.contentId = page.contentId;
			this.pageId = page.pageId;
			this.isSectionContentModal = true;
			this.image_url = this.image_base_url+''+page.contentId;
			this.isImage = true;
			this.updateSectionContentForm.patchValue({
				title : page.title,
				subtitle : page.subtitle,
				description : page.content,
				sectionIndex:page.sectionIndex,
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
			this.isDisabled = true;
		if(this.updateSectionContentForm.invalid) {
			this.isDisabled = false;
			return;
		} else {
			const formData = new FormData();
			formData.append('title', formValue.title);
			formData.append('subtitle', formValue.subtitle);		   
			if(this.images){
				this.images.forEach(obj =>{
					formData.append('image',obj );
				})
			}
			formData.append('content', formValue.description);
			formData.append('pageId', this.pageId);
			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'pages/content/'+this.contentId, formData, httpOptions).subscribe((response:any) => {
				this.toastr.successToastr(response.message,'Success');
				this.submitted = false;
				this.updateSectionContentForm.reset();
				this.isSectionContentModal = false;
				this.image_url = '';
				this.isImage = false;
				this.urls = '';
				this.isDisabled = false;
				this.getPageContent(this.pageId);
			},error =>{
				this.isError = true;
				this.toastr.errorToastr(error.error.status,'Error');
				this.errorsArr = error.error;
				this.isDisabled = false;
			});
		}
	}

	showRelatedImages(page) {
		this.title = page.title;
		this.isShowRelatedimages = true;
		this.imagesArray = page.images;
		if(this.imagesArray.length > 0 ) {
			this.isNullPreviousimage = false; 
			this.isPreviousimage = true; 
		} else {
			this.isPreviousimage = false; 
			this.isNullPreviousimage = true; 
		}
	}

	closeImageModal() {
		this.isDisabled = false;
		this.isShowRelatedimages = false;
		this.isSuccess  = false;
	}

	deleteImage(image) {
		this.isSuccess  = false;
	    this.deleteMessage = '';
		this.isDisabled = true;
		this.data_service.deleteImage(image).subscribe((response:any)=> { 
			this.isSuccess  = true;
			this.deleteMessage = response.message;
			this.isShowRelatedimages = true;
			this.imagesArray.splice(image.keyId, 1);
			if(this.imagesArray.length > 0 ) {
			this.isNullPreviousimage = false; 
				this.isPreviousimage = true; 
			} else {
				this.isPreviousimage = false; 
				this.isNullPreviousimage = true; 
			}
			this.isDisabled = false;
		},error => {
			this.isDisabled = false;
			this.isError = true; 
			this.errorsArr = error.error;
		});
	}
}


