import { Component, OnInit, HostListener} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 

@Component({
	selector: 'app-house-chores',
	templateUrl: './house-chores.component.html',
	styleUrls: ['./house-chores.component.css']
})

export class HouseChoresComponent implements OnInit {

	isSuccess = false;
	isLoading = false;
	display='none';
	isWelcomeModal : boolean = false;
	keyboard : boolean = false;
	key : any;
	isShow : any;
	isHouse1st:boolean =false;
	isWelcomeBlock: boolean =false;
	isBrightNestBlock: boolean =false;
	isNextStep:boolean =false;
	isProgressBlue:boolean = true;
	islockbgblue:boolean =true;
	isHomeQuizStep : any;
	isNextStep1:boolean= false;
	isNextStep2:boolean= false;

	addTaskForm: FormGroup;
	submitted = false;
	allUsersArray: any = [];
	allUsers:any = [];
	isError: boolean = false;
	errorsArr:any = []; 
	allCategoriesArray: any = [];
	allCategories: any = [];
	base_url ='';
	fileData:any;
	url :any  = []; 
	allTeamArray: any = [];
    allTeam: any = [];

	constructor(
			private formBuilder:FormBuilder,	
			private router: Router,
			private data_service : DataService,
			public toastr: ToastrManager,
			private http : HttpClient,
			private datePipe: DatePipe
		) { 
		this.addTaskForm = this.formBuilder.group({
			taskName: ['', Validators.required],
			assignTo: ['', Validators.required],
			dueDate: ['', Validators.required],
			category: ['', Validators.required],
			image: ['', Validators.required],
			notes: ['', Validators.required],

		});
		this.base_url = environment.base_url;
	}
	ngOnInit() {
		this.isWelcomeModal = true;  
		this.keyboard =true;
		this.display ='none';
		this.isWelcomeBlock =true;	
		this.isHouse1st=true;
		this.isProgressBlue =false;

		this.getUsers();
		this.getCategories();
		this.getTeams();
	}
	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {

		this.key = event.keyCode;
		//console.log(this.key);
		if (this.key) {
			this.close_welcome();
		}
	}
	close_welcome(){
		this.isWelcomeModal = false;
	}
	openNextTabModal(id) {

		this.isWelcomeBlock = false;
		this.isBrightNestBlock =true;
		this.isNextStep =true;
		this.isProgressBlue =true;
		this.islockbgblue = false;
	}
	onNextStepClick(id) {
		console.log('id', id);
		if(id == '1'){
			this.isNextStep =false;
			this.isNextStep1 = true;
			this.isNextStep2 = false;
		} else if(id == '2'){
			this.isNextStep = false;
			this.isNextStep1 = false;
			this.isNextStep2 = true;
		} else {
			this.isNextStep =false;
			this.isNextStep1 = false;
			this.isNextStep2 = false;
		}
		this.isHouse1st = false;
		this.isHomeQuizStep = id;
	}
	getUsers() {
		this.data_service.getUsers().subscribe((response:any) =>{   
			this.allUsersArray = this.allUsersArray.concat(response.users);
			this.allUsers = this.allUsersArray;
			//console.log('allUsers',this.allUsers);
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	getCategories() {
		this.data_service.getCategories().subscribe((response:any) =>{   
			this.allCategoriesArray = this.allCategoriesArray.concat(response.categories);
			this.allCategories = this.allCategoriesArray;
			//console.log('allCategories',this.allCategories);
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
    getTeams() {
		this.data_service.getTeams().subscribe((response:any) =>{   
			this.allTeamArray = this.allTeamArray.concat(response.teams);
			this.allTeam = this.allTeamArray;
			console.log('allTeam',this.allTeam);
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	get f() {  
		return this.addTaskForm.controls; 
	}
	onSelectFile(event) {
		 this.fileData = event.target.files[0];
		  this.preview();
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
	    }
     }
	addTask(form){
		console.log('ffsdf ',form);
		this.submitted = true;  
		if (this.addTaskForm.invalid) {
			return;
		}else{  
			const input_data = { 
				"task_name" : form.taskName, 
				"assign_to" : form.assignTo,
				"due_date" : this.datePipe.transform(form.dueDate, 'yyyy-MM-dd'),
				"photo" : this.fileData,
				"category" : form.category,
				"notes" : form.notes,
			} 
			//console.log(input_data);  
			const formData = new FormData();
			formData.append('task_name', input_data.task_name);
			formData.append('assignTo', input_data.assign_to);	   
			formData.append('due_date', input_data.due_date);
			formData.append('photo', this.fileData);
			formData.append('category_id', input_data.category);
			formData.append('notes', input_data.notes);   

			console.log('form data',formData);
			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			  const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			  this.http.post(this.base_url+'createTask', formData, httpOptions).subscribe((response:any) => {
			 //console.log('response response',response); 
		      this.toastr.successToastr('Task added successfully.', 'Success!');
	          this.addTaskForm.reset();
	          this.isError = false;
	          this.isSuccess = true;  	
			},error=>{ 
				this.toastr.errorToastr(error.error, 'Error!');
			});   
		}
	}
} 



