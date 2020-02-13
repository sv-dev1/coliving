import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
	selector: 'app-faq-pagecomponent',
	templateUrl: './faq-pagecomponent.component.html',
	styleUrls: ['./faq-pagecomponent.component.css']
})
export class FaqPagecomponentComponent implements OnInit {

	public Editor = ClassicEditor;
	faqForm : FormGroup;
	submitted : boolean = false;
	isopenAddFaqModal : boolean = false;
	isError : boolean = false;
	errorsArr : string = '';

	updateFaqForm : FormGroup;
	isalreadyEixst : boolean = false;
	isalreadyEixstErr : string = '';
	faqEdit : string = ''; 
	isopenEditFaqModal : boolean = false;
	
	allFaqArray : any = [];
	faqCount : any ;
	isArrayLength : boolean = false;
	faqName  : string = ''; 
	faqId : string = ''; 
	isDelFaq : boolean = false;
	response :  any = [];

	descriptionEmpty : boolean = false;
	constructor( 
		private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient
		) { 
		this.faqForm = this.formBuilder.group({
			question: ['', Validators.required],
			description: ['', Validators.required]
		});
		this.updateFaqForm = this.formBuilder.group({
			question: ['', Validators.required],
			description: ['', Validators.required]
		});
	}
	ngOnInit() {
	 /*   if(sessionStorage.getItem("roleId") != '1'){
                this.router.navigate(['/dashboard']);
          }*/
         this.getFaqs();
     }

     getFaqs() {
     	this.data_service.getCategories().subscribe((response:any) =>{   
     		this.allFaqArray = response.categories;
     		this.faqCount = this.allFaqArray.length;
     		if(this.allFaqArray.length > 10 ) {
     			this.isArrayLength  = true;
     		}
     		this.isError = false;    
     	}, error =>{ 
     		this.isError = true; 
     		this.errorsArr = error.error;
     	})
     }

     openAddCategoryModal(){
     	this.isopenAddFaqModal = true;
     }

     closeModal(){
     	this.isopenAddFaqModal = false;
     	this.submitted = false;     
     	this.faqForm.reset(); 
     }

     get f() { return this.faqForm.controls; }

     addFaq(formValue){
     	this.submitted = true;
     	if(formValue.description == ""){
     		this.descriptionEmpty = true;
     	}
     	if(this.faqForm.invalid) {
     		return;
     	}else{
     		const input = {  
     			"question": formValue.category, 
     			"description": formValue.description,   
     		}
     		this.data_service.addFaq(input).subscribe((response:any)=> { 
     			this.toastr.successToastr(response.message,'Success');
     			this.submitted = false;
     			this.isopenAddFaqModal = false;           
     			this.faqForm.reset();
     		},error =>{
     			this.isError = true; 
     			this.errorsArr = error.error;
     			if(error.error.name) {
     				this.isalreadyEixst = true;
     				this.isalreadyEixstErr = error.error.name;
     			}
     		});
     	}
     }
     editFaqModal(faq){
     	this.faqEdit = faq.id;
     	this.isopenEditFaqModal = true;
     	this.updateFaqForm.patchValue({
     		category : faq.question,
     		description : faq.description
     	});
     }
     closeEditModal(){
     	this.isopenEditFaqModal = false;
     	this.updateFaqForm.reset();
     }
     get g() { return this.updateFaqForm.controls; }

     updateFaq(formValue) {
     	this.submitted = true;
     	if(this.updateFaqForm.invalid) {
     		return;
     	}else{
     		const input = {  
     			"category_id": this.faqEdit,
     			"question": formValue.category, 
     			"description": formValue.description,   
     		}
     		this.data_service.editCategory(input).subscribe((response:any)=> { 
     			this.toastr.successToastr(response.message,'Success');
     			this.submitted = false;
     			this.isopenEditFaqModal = false;           
     			this.updateFaqForm.reset();
     			this.getFaqs();
     		},error =>{
     			this.isError = true; 
     			this.errorsArr = error.error;
     			if(error.error.name) {
     				this.isalreadyEixst = true;
     				this.isalreadyEixstErr = error.error.name;
     			}
     		});
     	}
     }
     deleteCategoryModal(faq) {
     	this.faqName = faq.name;
     	this.faqId = faq.id;
     	this.isDelFaq = true;
     }
     closeDelModal(faqName){
     	this.toastr.infoToastr('All information associated to the faq '+faqName+' are safe.');
     	this.isDelFaq=false;
     }

     deleteFaq(faqId){
     	if(faqId){
     		this.data_service.deleteFaq(faqId).subscribe((response:any) =>{
     			this.response = JSON.stringify(response, undefined, 2); 
     			this.isDelFaq = false;
     			this.getFaqs();
     			this.toastr.successToastr(response.message,'Success');
     			this.router.navigate(['/admin/faq-page-content']);  
     			this.isError = false;
     		}, error =>{ 
     			this.isError = true; 
     		})
     	}
     }
 }
