import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
	selector: 'app-house-chores',
	templateUrl: './house-chores.component.html',
	styleUrls: ['./house-chores.component.css']
})

export class HouseChoresComponent implements OnInit {
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

	constructor(
			private formBuilder:FormBuilder,	
	        private router: Router,
	        private data_service : DataService,
	        public toastr: ToastrManager
        ) { 
	    this.addTaskForm = this.formBuilder.group({
		     
	    });
	 }

	ngOnInit() {
		this.isWelcomeModal = true;  
		this.keyboard =true;
		this.display ='none';
		this.isWelcomeBlock =true;	
		this.isHouse1st=true;
		this.isProgressBlue =false;
	}

	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {

		this.key = event.keyCode;
		console.log(this.key);
		if (this.key) {
			this.close_welcome();
		}
	}
	close_welcome(){
		this.isWelcomeModal = false;

	}
	openAddTaskModal() {
		this.isLoading = true;
		this.display='block';
	}
	openNextTabModal(id) {

		this.isWelcomeBlock = false;
		this.isBrightNestBlock =true;
		this.isNextStep =true;
		this.isProgressBlue =true;
		this.islockbgblue = false;
	}
	onNextStepClick(id) {
		if(id == '1'){
			this.isNextStep =false;
			this.isNextStep1 = true;
		}else if(id == '2'){
			this.isNextStep =false;
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
    addTask(){

    
   }

} 



