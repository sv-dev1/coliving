import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 


@Component({
	selector: 'app-flatmate-issues',
	templateUrl: './flatmate-issues.component.html',
	styleUrls: ['./flatmate-issues.component.css']
})
export class FlatmateIssuesComponent implements OnInit {

	url :any ='';
	isAddIssueModal:boolean =false;
	submitted:boolean =false;
	addIssueForm:FormGroup;
	fileData:any;
	isError : boolean = false;
	isSuccess : boolean = false;
	errorsArr:any = []; 
	teamData: any;
	dropdownList = [];
	dropdownSettings = {};
	userdropdownList = [];
	userselectedItems = [];
	userdropdownSettings={};
	teamuser: any;
	list : any =[];
	teamName: any = [];
	assignUser: any=[];
	base_url : string = "";
	teamEmpty:boolean=false;
    userEmpty:boolean=false;
    allIssues: any = [];
    issuesCount : any;
    image_base_url:any;

	constructor(
		private formBuilder:FormBuilder,	
		private router: Router,
		private data_service : DataService,
		public toastr: ToastrManager,
		private http : HttpClient,
		) {
		this.addIssueForm = this.formBuilder.group({
			title: ['', Validators.required],
			description: ['', Validators.required],
			image: ['', Validators.required],
			team: ['', Validators.required], 
			assign_to:['', Validators.required],
		});
		this.base_url = environment.base_url;
		this.image_base_url = environment.image_base_url;
	}

	ngOnInit() {
		this.getTeam();
		this.getIssues();
	}

	openAddIssueModal(){
		this.isAddIssueModal = true;
	}

	closeModal(){
		this.isAddIssueModal = false;
		this.submitted = false;    
		this.addIssueForm.reset(); 
		
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

	get f() {  
		return this.addIssueForm.controls; 
	}

	addIssue(){
		
		if(this.addIssueForm.value['team']=="") {
			this.teamEmpty=true;
		}
		if(this.addIssueForm.value['assign_to']=="") {
			this.userEmpty=true;
		}
		this.submitted = true;
		if (this.addIssueForm.invalid) {
			return;
		}
		else{
			let data=this.addIssueForm.value;
			data.team.forEach(element => {
				this.teamName.push(element.id);
			});
			data.assign_to.forEach(element => {
				this.assignUser.push(element.id);
			});
			const input_data = {
				"title" : data.title,
				"desc" : data.description,      
				"teamId" : this.teamName,
				"photo" : this.fileData,
				"assign_to" : this.assignUser,
				"userId":sessionStorage.getItem('userId')
			}
			const formData = new FormData();
			formData.append('title', input_data.title);
			formData.append('desc', input_data.desc);	   
			formData.append('teamId', input_data.teamId);
			formData.append('photo', input_data.photo);
			formData.append('assign_to', input_data.assign_to);
			formData.append('createdBy', input_data.assign_to);

			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'issues/create', formData, httpOptions).subscribe((response:any) => {
				console.log('response', response);
				this.toastr.successToastr(response.message, 'Success!');
				this.submitted = false;
				this.url = '';
				this.addIssueForm.reset();
				this.isAddIssueModal = false;
                 

			},error=>{ 
				this.errorsArr =error;

			});
		}
	}

	getTeam(){        
		this.data_service.getTeam().subscribe((response:any) =>{  
			this.teamData=response['teams'];
			this.teamData.forEach(ele => {
				let obj = {};
				obj['id'] = ele['teamId'];
				obj['itemName'] = ele['name'];
				this.dropdownList.push(obj);
			});
			this.dropdownSettings = { 
				singleSelection: false, 
				text:"Select Team",
				selectAllText:'Please select one team.',
				unSelectAllText:'UnSelect All',
				classes:"myclass custom-class",
				limitSelection: 1,
				enableSearchFilter: true,

			};
		}, error =>{
			this.isError = true;   
			window.scrollTo(0, 0);
			this.errorsArr = JSON.parse(error._body);
			this.toastr.errorToastr(this.errorsArr, 'Error!');
		})
	}

	onTeamSelection() { 
		let tmp = [];
		let postArr = {'teamId': this.list};
		this.data_service.getTeamUsers(postArr).subscribe((response:any) =>{  
			this.teamuser = response.teams;
			console.log('users', this.teamuser);
			for(let i=0; i < this.teamuser.length; i++) {
				if(this.teamuser[i].userProfile){
					tmp.push({ id: this.teamuser[i].userProfile['userId'], itemName: this.teamuser[i].userProfile['firstName']+' '+this.teamuser[i].userProfile['lastName']});
				}}
				this.userdropdownList = tmp;
				this.userdropdownSettings = { 
					singleSelection: false, 
					text:"Select User",
					selectAllText:'Select All',
					unSelectAllText:'UnSelect All',
					classes:"myclass custom-class",
					limitSelection: 2,
				    enableSearchFilter: true,

				};
			}, error =>{
				this.isError = true;   
				window.scrollTo(0, 0);
				this.errorsArr = JSON.parse(error._body);
				this.toastr.errorToastr(this.errorsArr, 'Error!');
				// console.log(JSON.stringify(this.errorsArr, undefined, 2))
			})
	}
	onItemSelect(item:any){
		this.list.push(item['id']);
		this.onTeamSelection();
		this.teamEmpty = false;
	}
	OnItemDeSelect(item:any){
		this.list.splice(this.list.indexOf(this.list), 1);
		this.onTeamSelection();
		this.teamEmpty = true;
	}
	onSelectAll(items: any){
		items.forEach(element => {
			this.list.push(element['id']);
		});
		this.onTeamSelection();
	}
	onDeSelectAll(items: any){
		this.list=[];
		this.onTeamSelection();
		this.teamEmpty = true;
	}
	onUserSelectAll(items: any){
		this.userselectedItems.push(items);
		//console.log(this.userselectedItems);
	} 
	onUserItemSelect(item:any){
		this.userselectedItems.push(item);
		this.userEmpty = false;
		//console.log(this.userselectedItems);
	}
	OnUserItemDeSelect(item:any){
        this.userEmpty = true;
    }
    onUserDeSelectAll(items: any){
        this.userEmpty = true;
    }

    getIssues() {
        this.data_service.getAllIssues().subscribe((response:any) =>{ 
        console.log('response',response.issues);  
			this.allIssues = response.issues;
			this.issuesCount = this.allIssues.length;
			console.log('this.allIssues',this.allIssues);
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
    }
}
