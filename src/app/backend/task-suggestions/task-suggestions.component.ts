import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-task-suggestions',
	templateUrl: './task-suggestions.component.html',
	styleUrls: ['./task-suggestions.component.css']
})
export class TaskSuggestionsComponent implements OnInit {
	task_id:any ='';
	user_id:any ='';
	errorsArr:any;
	taskByIdArray:any=[];
	taskById:any=[];
	addSuggestionForm: FormGroup;
	submitted = false; 
	fagree =false;
	isError : boolean = false;
	isSuccess : boolean = false;
	errorsArrUser:any =[]; 

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
	}

	ngOnInit() {
		let url = this.route.snapshot.url.join().split(',')
		this.task_id = url[1];
		this.getTaskSuggestionByTeamId(this.task_id); 
		//console.log('teamId',this.task_id);
		
	}
	getTaskSuggestionByTeamId(teamID){

		this.data_service.getTaskSuggestionByTeamId(teamID).subscribe((response:any) =>{   
			this.taskByIdArray = this.taskByIdArray.concat(response.suggestionList);
			this.taskById = this.taskByIdArray;
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
				console.log('after',response);
				this.toastr.successToastr(response.message, 'Success!');		
				this.isError = false;
				this.isSuccess = true;   
				this.submitted = false;  
			    this.addSuggestionForm.reset();
			    this.getTaskSuggestionByTeamId(this.task_id); 
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
