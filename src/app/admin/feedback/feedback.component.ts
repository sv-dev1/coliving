import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
	selector: 'app-feedback',
	templateUrl: './feedback.component.html',
	styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

	public Editor = ClassicEditor;
	feedbacks : any = [];
	feedbacksCount:  any; 
	isArrayLength : boolean = false;
	isError : boolean = false;
	errorsArr : any = [];
	feedbackForm : FormGroup;
	base_url : any;
	isOpen : boolean = false;
	submitted : boolean = false;
	url : any ;
	isImage :  boolean = false;
	images : any = [];
	urls :  any = [];

	updatefeedbackForm : FormGroup;
	feedbackEdit : string = '';
	isOpenEdit : boolean = false;
	image_url : any;
	image_base_url : any;
	descriptionEmpty : boolean = false;
	isDelfeedback : boolean = false;
	response :  any = [];
	feedbackId : string = '';

	constructor(private formBuilder:FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient) { 
		this.feedbackForm = this.formBuilder.group({
			title: ['', Validators.required],
			authorName: ['', Validators.required],
			authorAddress: ['', Validators.required],
			rating: ['', Validators.required],
			description: ['', Validators.required],
			image:['']
		});
		this.updatefeedbackForm = this.formBuilder.group({
			title: ['', Validators.required],
			authorName: ['', Validators.required],
			authorAddress: ['', Validators.required],
			rating: ['', Validators.required],
			description: ['', Validators.required],
			image:['']
		});

		this.base_url = environment.base_url;
		this.image_base_url = environment.image_base_url;
	}

	ngOnInit() {
		this.getFeedbacks();
	}
	getFeedbacks() {
	      this.data_service.getFeedbacks().subscribe((response:any) =>{ 
		  this.feedbacks = response.HappyResidentsDetails;
		  this.feedbacksCount = this.feedbacks.length;
		  if(this.feedbacksCount > 10) {
			this.isArrayLength = true;
		 }
		 this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	openFeedbackModal () {
		this.isOpen = true;
	}

	closeModal(){
		this.isOpen = false;
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

	addFeedback(formValue){
		this.submitted=true;
		if(this.feedbackForm.invalid){
			return;
		} else {
			console.log(this.feedbackForm.value);
			const formData = new FormData();
			formData.append('title', formValue.title);
			formData.append('authername', formValue.authorName);
			if(this.images){
				this.images.forEach(obj =>{
					formData.append('image',obj );
				})
			}			
			formData.append('autheraddress', formValue.authorAddress);
			formData.append('rating', formValue.rating);
			formData.append('description', formValue.description);

			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'hr/addhr', formData, httpOptions).subscribe((response:any) => {

				this.toastr.successToastr(response.message,'Success');
				this.isOpen = false;
				this.submitted = false;
				this.feedbackForm.reset();
				this.getFeedbacks();
			},error =>{
				this.isError = true;
				this.toastr.errorToastr(error.error.status,'Error');
				this.errorsArr = error.error;
				
			});
		}
	}

	get f() { return this.feedbackForm.controls; }

	editfeedbackModal(feedback){
	    console.log('feedback', feedback);
		this.feedbackEdit = feedback.hrId;
		this.isOpenEdit = true;
		this.image_url = feedback.logo;
		this.updatefeedbackForm.patchValue({
			title : feedback.title,
			authorName : feedback.authername,
			authorAddress : feedback.autheraddress,
			rating : feedback.rating,
			description : feedback.description,
			image:[''],
		});
	}

    closeEditModal(){
		this.isOpenEdit = false;
	}

	get g() { return this.updatefeedbackForm.controls; }

	updateFeedback (formValue) {
        this.submitted = true;
		if(formValue.address) {
			this.descriptionEmpty = true;
		}
		if(this.updatefeedbackForm.invalid) {
			return;
		}else{
			const formData = new FormData();
			
			formData.append('title', formValue.title);
			formData.append('authername', formValue.authorName);
			if(this.images){
				this.images.forEach(obj =>{
					formData.append('image',obj );
				})
			}			
			formData.append('autheraddress', formValue.authorAddress);
			formData.append('rating', formValue.rating);
			formData.append('description', formValue.description);

			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'hr/edithr/'+this.feedbackEdit, formData, httpOptions).subscribe((response:any) => {
				this.toastr.successToastr(response.message,'Success');
				this.submitted = false;
				this.getFeedbacks();
				this.updatefeedbackForm.reset();
				this.isOpenEdit = false;
			},error =>{
				this.isError = true;
				this.toastr.errorToastr(error.error.status,'Error');
				this.errorsArr = error.error;
			});
		}
	}
	 deleteFeedbackModal(feedback) {

          this.feedbackId = feedback.id;
          this.isDelfeedback = true;
     }

     closeDelModal(){
     	this.toastr.infoToastr('All information associated to the faq are safe.');
     	this.isDelfeedback = false;
     }

    deleteFeedback(feedbackId){
    	
     	if(feedbackId){
               
     		this.data_service.deletefeedback(feedbackId).subscribe((response:any) =>{
     			this.response = JSON.stringify(response, undefined, 2); 
     			this.isDelfeedback = false;
     			this.getFeedbacks();
     			this.toastr.successToastr(response.message,'Success');
     			this.router.navigate(['/admin/customer-feedback']);  
     			this.isError = false;
     		}, error =>{ 
     			this.isError = true; 
     		})
     	}
     }

}
