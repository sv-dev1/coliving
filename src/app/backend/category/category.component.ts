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
  
	   allCategoriesArray:any =[];
	   allCategories:any =[];
	   isError:boolean=false;
	   errorsArr:string ='';
	   isopenAddCategoryModal:boolean=false;
	   submitted:boolean=false;
       isSuccess : boolean = false;
       isalreadyEixst:boolean =false;
       isalreadyEixstErr:string=''

	   CategoryForm:FormGroup;

  constructor(
        private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient,
  	) { 
         this.CategoryForm = this.formBuilder.group({
			category: ['', Validators.required],
		});
     }

  ngOnInit() {
  	   this.getCategories();
  } 
 	getCategories() {
		this.data_service.getCategories().subscribe((response:any) =>{   
			this.allCategoriesArray = response.categories;
			this.allCategories = this.allCategoriesArray;
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
    	console.log('formValue',formValue);
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
}
