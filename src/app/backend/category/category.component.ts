import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  
	   allCategoriesArray : any = [];
	   allCategories : any = [];
	   isError : boolean = false;
	   errorsArr : string = '';
	   isopenAddCategoryModal : boolean = false;
	   submitted : boolean = false;
       isSuccess : boolean = false;
       isalreadyEixst : boolean = false;
       isalreadyEixstErr : string = ''
	   CategoryForm : FormGroup;
	   updateCategoryForm : FormGroup;
	   isopenEditCategoryModal : boolean = false;
	   isDelCategory : boolean = false;
       categoryName : string = '';
	   categoryId : string = '';
	   response : any;
       isArrayLength : boolean = false;
       categoryEdit : string = '';
       p : any;
       categoryCount : any;


  constructor(
        private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient,
  	) { 
        this.CategoryForm = this.formBuilder.group({
			category: ['', Validators.required],
			description: ['']
		});
		this.updateCategoryForm = this.formBuilder.group({
			category: ['', Validators.required],
			description: ['']
		});
     }

	ngOnInit() {
			 if(sessionStorage.getItem("roleId") == '1' || sessionStorage.getItem("roleId") == '3' || sessionStorage.getItem("roleId") == '4'){
			      this.router.navigate(['/']);
			 }
	  	   this.getCategories();
	} 
 	getCategories() {
		this.data_service.getCategories().subscribe((response:any) =>{   
			this.allCategoriesArray = response.categories;
			this.allCategories = this.allCategoriesArray;
			this.categoryCount = this.allCategories.length;
		    if(this.allCategories.length > 10 ) {
                  this.isArrayLength  = true;
		    }
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	openAddCategoryModal(){
       this.isopenAddCategoryModal = true;
    }
    closeModal(){
    	this.isopenAddCategoryModal = false;
    	this.submitted = false;     
    	this.isalreadyEixst = false;
        this.CategoryForm.reset(); 
    }

    get f() { return this.CategoryForm.controls; }

    addCategory(formValue){
    	
    	this.submitted = true;
	    if(this.CategoryForm.invalid) {
	        return;
	    }else{
	      const input = {  
	        "name": formValue.category, 
	        "description": formValue.description,   
	      }
	      this.data_service.addCategory(input).subscribe((response:any)=> { 
	          this.toastr.successToastr(response.message,'Success');
	          this.submitted = false;
	          this.isopenAddCategoryModal = false;           
	          this.CategoryForm.reset();
	          this.getCategories();
	        },error =>{
	          this.isError = true; 
	          this.errorsArr = error.error;
	          if(error.error.name) {
	          	   this.isalreadyEixst = true;
	               this.isalreadyEixstErr = error.error.name;
	          }
	        
	          //this.toastr.errorToastr(error.error.name,'Error');
	        });
	    }
    }
    editCategoryModal(category){
    	this.categoryEdit = category.category_id;
    	this.isopenEditCategoryModal = true;
    	this.updateCategoryForm.patchValue({
    	    	category: category.name,
    	    	description: category.description
    	});
    }
    closeEditModal(){
		this.isopenEditCategoryModal=false;
		this.updateCategoryForm.reset();
	}
	get g() { return this.updateCategoryForm.controls; }
	
    updateCategory(formValue) {
        
    	this.submitted = true;
	    if(this.updateCategoryForm.invalid) {
	        return;
	    }else{
	      const input = {  
	      	"category_id": this.categoryEdit,
	        "name": formValue.category, 
	        "description": formValue.description,   
	      }
	      
	      this.data_service.editCategory(input).subscribe((response:any)=> { 
	          this.toastr.successToastr(response.message,'Success');
	          this.submitted = false;
	          this.isopenEditCategoryModal = false;           
	          this.updateCategoryForm.reset();
	          this.getCategories();
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
    deleteCategoryModal(category) {
    	
    	this.categoryName = category.name;
		this.categoryId = category.category_id;
    	this.isDelCategory = true;
    }
    closeDelModal(categoryName){
		this.toastr.infoToastr('All information associated to the category '+categoryName+' are safe.');
		this.isDelCategory=false;
	}
    deleteCategory(categoryId){
       if(categoryId){
	        this.data_service.deleteCategory(categoryId).subscribe((response:any) =>{
	        this.response = JSON.stringify(response, undefined, 2); 
	        this.isDelCategory = false;
            this.getCategories();
	        this.toastr.successToastr(response.message,'Success');
	        this.router.navigate(['/categories']);  
	        this.isError = false;
	      }, error =>{ 
	        this.isError = true; 
	      //  this.toastr.errorToastr('Invalid Credentials','Error');
	      })
       }
	}
}
