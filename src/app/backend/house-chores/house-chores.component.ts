import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, HostListener,Renderer2 } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { Socket } from 'ng-socket-io';

@Component({
	selector: 'app-house-chores',
	templateUrl: './house-chores.component.html',
	styleUrls: ['./house-chores.component.css']
})

export class HouseChoresComponent implements OnInit {
  
	calendarVisible = true;
	calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
	calendarWeekends = true;
	calendarEvents: EventInput[] = [	{ title: '', start: "" , id:'' }];
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
	nickname: string = "";
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
	curr = new Date();
	eventInfo: boolean = false;
	addTaskModal:boolean=false;
	IsKid:boolean=false;
	IsPet:boolean=false;
	IsN:boolean=false;
	OtherProd:any=[];
	deleteTaskModal:boolean=false;
	taskName:string='';
	taskId:string='';
	response:any=[];
	tChoice: any =[];
    fChoice: any =[];
    progOne: boolean = false;
	progTwo: boolean = false;
	progre : boolean = true;
	finalProg: boolean = false;
	SubmitWelcome: boolean = false;
	party: boolean = false;
	welcomeform: FormGroup;
	welcomeError: boolean;
	quest: string;
	currDate:any=[];
	checkDate:any=[];
	singleTaskData: any;
	taskInfo:boolean=false;
    logged_in_id : string = "";
    valMessage: boolean = false;
    msgData:any=[];

	constructor(
		private formBuilder:FormBuilder,	
		private router: Router,
		private data_service : DataService,
		public toastr: ToastrManager,
		private http : HttpClient,
		private datePipe: DatePipe,
		private socket: Socket, 
		private renderer: Renderer2
		) { 
		this.addTaskForm = this.formBuilder.group({
			taskName: ['', Validators.required],
			assignTo: ['', Validators.required],
			dueDate: ['', Validators.required],
			category: ['', Validators.required],
			image: ['', Validators.required],
			notes: ['', Validators.required],
		});
		this.welcomeform = this.formBuilder.group({
			partying: ['', Validators.required],
			alcohol: ['', Validators.required],
			smoking: ['', Validators.required],
			apartment_clean_importance: ['', Validators.required],
			music: ['', Validators.required],
			apartment_party: ['', Validators.required],
			social_account: [''],
			religion: [''],
		});
		 this.base_url = environment.base_url;
		 this.today = new Date();
         this.socket.connect(); 
         this.logged_in_id = sessionStorage.getItem("userId");
       // console.log(this.logged_in_id);
	}

	ngOnInit() {
		this.quest=sessionStorage.getItem("questionaire");
		if(this.quest == "true"){
			console.log("already completed survey");
		
		}
		else{
			this.isWelcomeModal = true;  
			this.keyboard =true;
			this.display ='none';
			this.isWelcomeBlock =true;	
			this.isHouse1st=true;
			this.isProgressBlue =false;
			const html = document.getElementsByTagName('html')[0];
			html.classList.add('popCustomHtml');
			const body = document.getElementsByTagName('body')[0];
			body.classList.add('popCustomBody');
		}

		this.getUsers();
		this.getCategorie();
		this.getTeams();
		this.getTask();
		this.allTaskListing();
		this.logged_in_username = sessionStorage.getItem("user_name");
	}
     
	openChat(team,index){
		//console.log('team',team);
		this.team_id = team.teamId;
		this.user_id = this.logged_in_id;
		this.nickname = team.name;
		this.status = !this.status;
		this.indexCheck = index;	
		this.joinChat();
		this.getMessages();
		this.loadMyMessages();	
		this.loadMessages();
	}
	joinChat() { 
		if(this.user_id){
			this.data = {
				"nickname": this.nickname,
				"from_id": this.logged_in_id,
				"username": this.logged_in_username,
				"to_id": this.team_id,			
			}
		} else {
			this.by_default_team = this.firstTeam;
			this.data = {	
				"nickname": this.by_default_team.name,
				"from_id": this.logged_in_id,
				"username": this.logged_in_username,
				"to_id": this.by_default_team.teamId,
			}
		}

		
	//	console.log('join chat data', this.data);
		this.socket.emit('set-nickname', this.data);	
     	this.getMessages();
		this.loadMyMessages();
	}
	sendMessgae() {
		if(this.message == '') {
         this.valMessage = true;
         return;
		} else {
			if(this.user_id ==''){
			this.by_default_team = this.firstTeam;
			this.data = {
				"userId": this.logged_in_id,
				"teamId": this.by_default_team.teamId,
				"username": sessionStorage.getItem("user_name"),
				"msg": this.message
			}
		} else {
			this.data = {
				"userId": this.logged_in_id,
				"teamId": this.team_id,
				"username":this.logged_in_username,
				"msg": this.message
			}
		  }
		}
		console.log('data',this.data);
		this.socket.emit('newMessage', this.data);
		this.message = '';
		this.getMessages()
		this.loadMyMessages();
		this.loadMessages();
	}
	getMessages() {
		this.socket.on('getMessage', (data) => {
			console.log('getMessage',data);
			this.gruopMessages.push(data);	
			this.msgData = data;
		});  
		
	} 
	loadMyMessages() {
		this.socket.on('messages', (data) => {
			this.gruopMessages = data.messages; 
		//	console.log('gruopMessages',this.gruopMessages);
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
		this.nickname = this.nickname;
		this.socket.emit('load-messages', this.data);
         this.getMessages();
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
		//console.log(this.welcomeform.value);
		this.isWelcomeModal = false;
		const html = document.getElementsByTagName('html')[0];
		html.classList.remove('popCustomHtml');
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('popCustomBody');
	}
	openNextTabModal(id) {
		console.log("firstSelect",id);
		if(id == 1){
			this.IsKid=true;
		}
		if(id == 2){
			this.IsPet=true;
		}
		if(id == 3){
			this.IsN=true;
		}
		this.isWelcomeBlock = false;
		this.isBrightNestBlock =true;
		this.isNextStep =true;
		this.isProgressBlue =true;
		this.islockbgblue = false;

	}
	otherPro(event){
		if(event.target.checked){
			this.OtherProd.push(event.target.value);
		}
		else{
			for(var i=0;i<=this.OtherProd.length;i++)
			{
				if(this.OtherProd[i] == event.target.value){
					this.OtherProd.splice(i,1);
				}
			}
		}
		console.log("SecondChoice",this.OtherProd);
	}
	TChoice(event){
		if(event.target.checked){
			this.tChoice.push(event.target.value);
		}
		else{
			for(var i=0;i<=this.tChoice.length;i++)
			{
				if(this.tChoice[i] == event.target.value){
					this.tChoice.splice(i,1);
				}
			}
		}
		console.log("ThirdChoice",this.tChoice);
	}
	FChoice(event){
		if(event.target.checked){
			this.fChoice.push(event.target.value);
		}
		else{
			for(var i=0;i<=this.fChoice.length;i++)
			{
				if(this.fChoice[i] == event.target.value){
					this.fChoice.splice(i,1);
				}
			}
		}
		console.log("FourthChoice",this.fChoice);
	}
	choose(){
		this.party=true;
		this.isWelcomeBlock = false;
		this.isBrightNestBlock =true;
		this.isNextStep =true;
		this.isProgressBlue =true;
		this.islockbgblue = false;
	}
	back(id){
		if(id == '1'){
			this.isHomeQuizStep = 0;
			this.isHouse1st=true;
			this.isNextStep =true;
			this.isNextStep1 = false;
			this.isNextStep2 = false;
			this.progre=true;
			this.progOne = false;
		}
		if(id == '2'){
			this.isHomeQuizStep = 1;
			this.isNextStep = false;
			this.isNextStep1 = true;
			this.isNextStep2 = false;
			this.progOne = true;
			this.progTwo = false;

		}
		if(id == '3'){
			this.isHomeQuizStep = 2;
			this.isNextStep = false;
			this.isNextStep1 = false;
			this.isNextStep2 = true;
			this.progTwo = true;
			this.finalProg=false;
		}
	}
	onNextStepClick(id) {

		if(id == '1'){
			this.isNextStep =false;
			this.isNextStep1 = true;
			this.isNextStep2 = false;
			this.progOne = true;
		} else if(id == '2'){
			this.isNextStep = false;
			this.isNextStep1 = false;
			this.isNextStep2 = true;
			this.progTwo = true;
		} else {
			this.isNextStep =false;
			this.isNextStep1 = false;
			this.isNextStep2 = false;
			this.finalProg=true;
		}
		this.isHouse1st = false;
		this.isHomeQuizStep = id;
	}
	queSubmit(){
		this.submitted = true;  
		//console.log(this.welcomeform.value);
        if(this.wf.partying.errors && this.submitted){
			console.log("invalid");
		}
		if (this.welcomeform.invalid) {
			if(this.welcomeform.value['alcohol']=="" || this.welcomeform.value['partying']=="" || this.welcomeform.value['smoking']==""){
				this.isHomeQuizStep = 0;
				this.isNextStep =true;
				this.isNextStep1 = false;
				this.isNextStep2 = false;
				this.finalProg=false;
				this.progOne=false;
				this.progTwo=false;
				this.progre=true;
				this.isHouse1st=true;
				this.party=true;
			}
			else if(this.welcomeform.value['apartment_clean_importance']==""){
				this.isHomeQuizStep = 1;
				this.isNextStep =false;
				this.isNextStep1 = true;
				this.isNextStep2 = false;
				this.finalProg=false;
				this.progOne=true;
				this.progTwo=false;
				this.progre=false;
				this.isHouse1st=false;
			}
			else if(this.welcomeform.value['music']=="" || this.welcomeform.value['apartment_party']==""){
				this.isHomeQuizStep = 2;
				this.isNextStep =false;
				this.isNextStep1 = false;
				this.isNextStep2 = true;
				this.finalProg=false;
				this.progOne=false;
				this.progTwo=true;
				this.progre=false;
				this.isHouse1st=false;
			}
		    return;
		}
		this.data_service.submitQuest(this.welcomeform.value).subscribe((response:any) =>{  
	//		console.log('after submit response',response);
			this.toastr.successToastr('Survey Completed.', 'Success!');
			this.submitted=false;
			this.isWelcomeModal = false;
			const html = document.getElementsByTagName('html')[0];
			html.classList.remove('popCustomHtml');
			const body = document.getElementsByTagName('body')[0];
			body.classList.remove('popCustomBody');
		}, error =>{
			console.log(error);
			this.toastr.errorToastr(error.error);
 		})
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
		//	console.log(this.allTeam);
			this.firstTeam = this.allTeam[0];
			//console.log("firsttema", this.firstTeam);
			this.isError = false;
			this.joinChat();
			this.loadMessages();    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})

	}
	deleteTaskDailog(task){
		 //console.log('task',task);
		   this.taskName = task.task_name;
		   this.taskId = task.id;
           this.deleteTaskModal=true;
		   this.renderer.addClass(document.body, 'modal-open');
	}
	closeDeleteTaskModal(taskName){
		this.deleteTaskModal=false;
		this.renderer.removeClass(document.body, 'modal-open');
		this.toastr.infoToastr('All information associated to the task '+taskName+' are safe.');
	}
	closeDeleteTaskModal1(){
		this.deleteTaskModal=false;
		this.renderer.removeClass(document.body, 'modal-open');
	}
	deleteTask(taskId){
       if(taskId){
	        this.data_service.deleteTask(taskId).subscribe((response:any) =>{
	        this.response = JSON.stringify(response, undefined, 2); 
	        this.closeDeleteTaskModal1();
            this.allTaskListing();
	        this.toastr.successToastr(response.message,'Success');
	        this.router.navigate(['/house-chores']);  
	        this.isError = false;
	      }, error =>{ 
	        this.isError = true; 
	      //  this.toastr.errorToastr('Invalid Credentials','Error');
	      })
       }
	}
	get f() {  
		return this.addTaskForm.controls; 
	}
	get wf(){
		return this.welcomeform.controls;
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
	
	getTask() {
		this.calendarEvents=[];
		this.data_service.getTask().subscribe((response:any) =>{   
			response.tasks.forEach(element => {
				this.allTask.push({id: element.taskId, name:element.task_name,date:element.due_date,notes:element.notes, });
				this.calendarEvents = this.calendarEvents.concat({ 
					title: element.task_name,
					start: element.due_date,
					id:element.taskId
				})
			});
		
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
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
				"photo" :    this.fileData,
				"category" : form.category,
				"notes" : form.notes,
			} 
			const formData = new FormData();
			formData.append('task_name', input_data.task_name);
			formData.append('assignTo', input_data.assign_to);	   
			formData.append('due_date', input_data.due_date);
			formData.append('photo', this.fileData);
			formData.append('category_id', input_data.category);
			formData.append('notes', input_data.notes);   
			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'createTask', formData, httpOptions).subscribe((response:any) => {
				this.toastr.successToastr('Task added successfully.', 'Success!');
				this.isError = false;
				this.addTaskModal=false;
				this.isSuccess = true; 
				this.submitted = false;   	
				this.addTaskForm.reset();
				this.allTaskListing();
				this.url ='';
			},error=>{ 
				this.toastr.errorToastr(error.error, 'Error!');
			});   
		}
	}

	handleDateClick(arg) {
		this.currDate=this.datePipe.transform(this.curr, 'yyyy-MM-dd');
		this.checkDate=arg.dateStr;

	    if(this.checkDate < this.currDate)
      {
		         //	console.log("previous");  
      }
      else {
	     	//console.log("next");
			this.eventInfo=true;
			this.addTaskModal=true;
			this.renderer.addClass(document.body, 'modal-open');
      }
 
	}
	openaddTask(){
		this.addTaskModal=true;
		this.renderer.addClass(document.body, 'modal-open');
	}
	close(){
		this.addTaskModal=false;
		this.submitted = false;   
		this.taskInfo=false;	
		this.addTaskForm.reset();
		this.renderer.removeClass(document.body, 'modal-open');
		const html = document.getElementsByTagName('html')[0];
		html.classList.remove('popCustomHtml');
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('popCustomBody');
	}
	event(event){
		this.currDate=this.datePipe.transform(this.curr, 'yyyy-MM-dd');
		this.checkDate=this.datePipe.transform(event.event._instance.range.start, 'yyyy-MM-dd');
		if(this.checkDate < this.currDate)
		{
			console.log("previous");  
		}
		else {
			 this.taskInfo=true;
			 let event_id=event.event._def.publicId;
			 this.data_service.getTaskById(event_id).subscribe((response:any) =>{   
				this.singleTaskData=response.suggestionList.taskArr;
		 }, error =>{ 
			 this.isError = true; 
			 this.errorsArr = error.error;
		 })
		}

	}
	allTaskListing() {
		this.allTask = [];
		this.allTaskArray = [];
		this.pending_length = [];
		this.complete_length = [];
		this.data_service.getTask().subscribe((response:any) =>{   
			this.allTaskArray = response.tasks;
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
	navigateToSuggestions(task){
		this.router.navigate(['/task-suggestions',task]);
	}	
	
}
