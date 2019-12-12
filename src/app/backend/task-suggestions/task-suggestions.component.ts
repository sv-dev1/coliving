import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-task-suggestions',
	templateUrl: './task-suggestions.component.html',
	styleUrls: ['./task-suggestions.component.css']
})
export class TaskSuggestionsComponent implements OnInit {
	task_id:any ='';
	user_id:any ='';
	errorsArr:any;
	suggestionsArray:any=[];
	suggestions:any=[];
	taskDetailArray:any=[];
	taskDetail:any=[];
	addSuggestionForm: FormGroup;
	submitted = false; 
	fagree =false;
	isError : boolean = false;
	isSuccess : boolean = false;
	errorsArrUser:any =[]; 
    demo:any=[];
    isSuggestion : boolean = false;
    image_base_url : any;
    
	constructor(
		private formBuilder:FormBuilder,	
		private router: Router,
		private data_service : DataService,
		public toastr: ToastrManager,
		private http : HttpClient,
		private route: ActivatedRoute
		) { 
		this.addSuggestionForm = this.formBuilder.group({
			suggestion: ['', Validators.required],
		});
		 this.image_base_url = environment.image_base_url;
		 
	}

	ngOnInit() {
		let url = this.route.snapshot.url.join().split(',')
		this.task_id = url[1];
		this.getTaskSuggestionByTaskId(this.task_id); 
		//console.log('teamId',this.task_id);
		 if(sessionStorage.getItem("roleId") == '3' || sessionStorage.getItem("roleId") == '4'){
		      this.router.navigate(['/dashboard']);
		 }

		
	}

	suggExp(){
		
		this.isSuggestion =! this.isSuggestion;
	}

	navigateToTaskList(){
	     this.router.navigate(['/house-chores']); 
	}
	
	getTaskSuggestionByTaskId(taskID){
        this.suggestionsArray = [];
        this.taskDetailArray = [];
		this.data_service.getTaskSuggestionByTeamId(taskID).subscribe((response:any) =>{   
			this.suggestionsArray = response.suggestionList.suggestionArr;
			this.suggestions = this.suggestionsArray;
			console.log('suggestions',this.suggestions);
			this.taskDetailArray = this.taskDetailArray.concat(response.suggestionList.taskArr);
			this.taskDetail= this.taskDetailArray;

			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	get f() {  
		return this.addSuggestionForm.controls; 
	}

	addSuggestion(formValue){
		this.submitted = true;
		if (this.addSuggestionForm.invalid) {
			return;
		}else{
			const input_data = {
				"notes" : formValue.suggestion,
				"taskId": this.task_id,
			}
			this.data_service.addSuggestion(input_data).subscribe((response:any) =>{  
				this.toastr.successToastr(response.message, 'Success!');		
				this.isError = false;
				this.isSuccess = true;   
				this.submitted = false;  
			    this.addSuggestionForm.reset();
			    this.getTaskSuggestionByTaskId(this.task_id); 
				this.router.navigate(['/task-suggestions',this.task_id]); 
  
			}, error =>{
				this.isError = true;   
				console.log(error);
				this.errorsArr = error;
				this.toastr.errorToastr(this.errorsArr, 'Error!');
				//console.log('dffsdfsd',JSON.stringify(this.errorsArr, undefined, 2))
			})
		}
	} 
}
