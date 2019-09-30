import { Component, OnInit, HostListener, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
//import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-house-chores',
	templateUrl: './house-chores.component.html',
	styleUrls: ['./house-chores.component.css']
})

export class HouseChoresComponent implements OnInit {
	//@ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template

	calendarVisible = true;
	calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
	calendarWeekends = true;
	calendarEvents: EventInput[] = [
	{ title: '', start: "" }
	];
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
	todayDate:boolean=false;
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
	allTaskArray: any = [];
	allTask: any = [];
	pending_length : any = [];
	complete_length : any = [];
	minimumDate = new Date();
	message: string = "";
	messages: any = [];
	teamName:string;
	today:any;
	team_id : string = "";
	user_id : string = "";
	logged_in_username : string = "";
	userDataArr:any=[];
	status: boolean = false;
	indexTab:any ="";
	firstTeam:any;
	data:any;
	data1:any=[];
	indexCheck = 0;
	by_default_team : any = [];
	gruopMessages : any = [];
	socket_url:string = '';
    socket:any=[];

	constructor(
		private formBuilder:FormBuilder,	
		private router: Router,
		private data_service : DataService,
		public toastr: ToastrManager,
		private http : HttpClient,
		private datePipe: DatePipe,
		//private socket: Socket
		
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
		this.today = new Date();
	//	this.socket_url = environment.socket_url;
     //   this.socket = io(this.socket_url);
 		// this.socket.connect(); 
	}

	ngOnInit() {
		this.isWelcomeModal = true;  
		this.keyboard =true;
		this.display ='none';
		this.isWelcomeBlock =true;	
		this.isHouse1st=true;
		this.isProgressBlue =false;
		this.getUsers();
		this.getCategorie();
		this.getTeams();
		this.getTask();
		this.allTaskListing();
		
		const html = document.getElementsByTagName('html')[0];
		html.classList.add('popCustomHtml');
		const body = document.getElementsByTagName('body')[0];
		body.classList.add('popCustomBody');

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
		const html = document.getElementsByTagName('html')[0];
		html.classList.remove('popCustomHtml');
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('popCustomBody');
	}
	openNextTabModal(id) {

		this.isWelcomeBlock = false;
		this.isBrightNestBlock =true;
		this.isNextStep =true;
		this.isProgressBlue =true;
		this.islockbgblue = false;
	}
	onNextStepClick(id) {
		//console.log('id', id);
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
			//console.log('allUsers',this.allUsers[0].login.username);
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	getCategorie() {
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
		this.data_service.getTeam().subscribe((response:any) =>{   
			this.allTeamArray = this.allTeamArray.concat(response.teams);
			this.allTeam = this.allTeamArray;
			//console.log(this.allTeam);
			this.firstTeam = this.allTeam[0];
			//console.log("firsttema", this.firstTeam);
			this.isError = false;
			this.loadMessages();    
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
		//console.log('ffsdf ',form);
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

			//console.log('form data',formData);
			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'createTask', formData, httpOptions).subscribe((response:any) => {
				//console.log('response response',response); 
				this.toastr.successToastr('Task added successfully.', 'Success!');
				
				this.isError = false;
				this.isSuccess = true; 
				this.submitted = false;   	
				this.addTaskForm.reset();
				this.url ='';
			},error=>{ 
				this.toastr.errorToastr(error.error, 'Error!');
			});   
		}
	}
	getTask() {
		this.data_service.getTask().subscribe((response:any) =>{   
			response.tasks.forEach(element => {
				this.allTask.push({id: element.taskId, name:element.task_name,date:element.due_date,notes:element.notes, });
				this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
					title: element.task_name,
					start: element.due_date,
				})
			});
			//console.log(this.calendarEvents);
			//		console.log(this.allTask);
			//	 this.allTaskArray = this.allTaskArray.concat(response.Task);
			// this.allTask = this.allTaskArray;
			// console.log('allTask',this.allTask);
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	handleDateClick(arg) {
		if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
			this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
				title: 'New Event',
				start: arg.date,
				allDay: arg.allDay
			})
		}
	}
	allTaskListing() {
		this.data_service.getTask().subscribe((response:any) =>{   
			this.allTaskArray = this.allTaskArray.concat(response.tasks);
			this.allTask = this.allTaskArray;
			//console.log('All Task',this.allTask);
			this.allTask.forEach(obj =>{
				if(obj.status == 'PENDING'){
					this.pending_length.push({id: obj.taskId,task_name:obj.task_name,photo:obj.photo,userId:obj.userId});
				} else if(obj.status == 'COMPLETE'){
					this.complete_length.push({id: obj.taskId,task_name:obj.task_name,photo:obj.photo,userId:obj.userId});
				}
			})
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	
	openChat(team,index){
		this.team_id = team.teamId;
		this.user_id = team.userId;
		this.logged_in_username = sessionStorage.getItem("user_name");
		this.status = !this.status;
		this.indexCheck = index;	
		this.loadMessages();		
	}

	sendMessgae() {
		if(this.user_id ==''){
			this.by_default_team = this.firstTeam;
			this.data = {
				"userId": this.by_default_team.userId,
				"teamId": this.by_default_team.teamId,
				"username": sessionStorage.getItem("user_name"),
				"msg": this.message
			}
		} else {
			this.data = {
				"userId": this.user_id,
				"teamId": this.team_id,
				"username":this.logged_in_username,
				"msg": this.message
			}
		}
		console.log('data',this.data);
		this.socket.emit('newMessage', this.data);
		this.message = '';
	}

	getMessages() {
		this.socket.on('getMessage', (data) => {
			console.log('getMessage',data);
			this.messages.push(data);   
		});  
	} 

	loadMyMessages() {
		this.socket.on('messages', (data) => {
			this.gruopMessages = data.messages; 
			console.log(this.gruopMessages);
		});

	}
	loadMessages() {
		if(this.user_id){
			this.data = {
				"userId": this.user_id,
				"teamId": this.team_id,
			}
		} else {
			this.by_default_team = this.firstTeam;
			this.data = {
				"userId": this.by_default_team.userId,
				"teamId": this.by_default_team.teamId,
			}
		}
		console.log('data', this.data);
		this.socket.emit('load-messages', this.data);
    this.getMessages();
	}


} 



