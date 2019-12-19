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
	addIssueReplyForm:FormGroup;
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
	teamEmpty : boolean = false;
    userEmpty : boolean = false;
    allIssues : any = [];
    issuesCount : any;
    image_base_url:any;
    threads : any = [];
    logged_in_id : string = "";
    isOpenthreadModal : boolean = false;
    issueResponse : any;
    issueName : any;
    issueId : any;
    deleteIssueModal : boolean = false;


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
		this.logged_in_id = sessionStorage.getItem("userId");
	

		this.addIssueReplyForm = this.formBuilder.group({
			message: ['', Validators.required],
			issueId: ['']
		})
	}
    
	ngOnInit() {
		this.getTeam();
		this.getIssues();
      console.log('this.base_url', this.base_url);
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
			let data = this.addIssueForm.value;
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
				this.toastr.successToastr(response.message, 'Success!');
				this.submitted = false;
				this.url = '';
				this.addIssueForm.reset();
				this.isAddIssueModal = false;
                this.getIssues();
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
			for(let i=0; i < this.teamuser.length; i++) {
				if(this.teamuser[i].userProfile){
					tmp.push({ id: this.teamuser[i].userProfile['userId'], itemName: this.teamuser[i].login.username});
				}}
				this.userdropdownList = tmp;
				this.userdropdownSettings = { 
					singleSelection: false, 
					text:"Select User",
					selectAllText:'Select All',
					unSelectAllText:'UnSelect All',
					classes:"myclass custom-class",
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
			this.allIssues = response.issues;
			this.issuesCount = this.allIssues.length;
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
    }

    openIssueThread(element) {
    	if(element) {
    		console.log(element);
    		this.isOpenthreadModal = true;
            this.data_service.getAllMessagesByIssueId(element.issueId).subscribe((response:any) =>{ 
			this.threads = response.issues;
			this.isError = false;    
			this.addIssueReplyForm.patchValue({
				issueId: element.issueId
			});
			console.log('this.thread', this.threads);
			}, error =>{ 
				this.isError = true; 
				this.errorsArr = error.error;
			})
    	}
    }
    close(){
        this.isOpenthreadModal = false;
    }

    get g() { return this.addIssueReplyForm.controls; }

    addIssueReply() {
        this.submitted = true;
		if (this.addIssueReplyForm.invalid) {
			return;
		}
		else{
			let data = this.addIssueReplyForm.value;
            const inputs = {
            	"userId" : this.logged_in_id,
            	"message" : data.message,
            	"issueId" : data.issueId,
            	"createdAt" : new Date() 
            }
            this.data_service.addReply(inputs).subscribe((response:any)=> { 
	          //this.toastr.successToastr(response.message,'Success');
	          this.submitted = false;
	          this.addIssueReplyForm.reset();
	          const inputIssueId = {
	          	 "issueId" : data.issueId
	          } 
	          this.openIssueThread(inputIssueId);
	        },error =>{
	          this.isError = true; 
	          this.errorsArr = error.error;
	        });
		}
    } 

    deleteIssueDailog(issue){
		   this.issueName = issue.title;
		   this.issueId = issue.issueId;
           this.deleteIssueModal = true;
	}

	deleteIssue(issueId)  {
       
        if(issueId){
	        this.data_service.deleteIssue(issueId).subscribe((response:any) =>{
	        this.issueResponse = JSON.stringify(response, undefined, 2); 
	        this.closeDeleteIssueModal1();
            this.getIssues();
	        this.toastr.successToastr(response.message,'Success');
	        this.router.navigate(['/house-chores']);  
	        this.isError = false;
	      }, error =>{ 
	        this.isError = true; 
	      //  this.toastr.errorToastr('Invalid Credentials','Error');
	      })
       }
	}

	closeDeleteIssueModal(issueName){
		this.deleteIssueModal = false;
		this.toastr.infoToastr('All information associated to the task '+issueName+' are safe.');
	}
	closeDeleteIssueModal1() {
		this.deleteIssueModal = false;
	}

}
