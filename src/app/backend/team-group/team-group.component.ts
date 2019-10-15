import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-team-group',
  templateUrl: './team-group.component.html',
  styleUrls: ['./team-group.component.css']
})
export class TeamGroupComponent implements OnInit {
    showCreate:boolean=false;
    hideCreate:boolean=false;
    createTeamForm: FormGroup;
    submitted = false; 
    isError : boolean = false;
    isSuccess : boolean = false;
    errorsArr:any = []; 
    teamData: any;
    users: any;
    usersId:any = []; 
    IsContinue : boolean = false;
    Isrequired : boolean = false;
    selectedButton = {}
    hide : boolean = true;
    selectUser : boolean = false;
    validationMessage:string = '';
    completed : boolean = false;
  constructor(
    private formBuilder:FormBuilder,	
    private router: Router,
    private data_service : DataService,
    public toastr: ToastrManager
  ) { 
     
     this.createTeamForm = this.formBuilder.group({
           name:['', [Validators.required, Validators.pattern(/^\S*$/)]],
     });
  }
  ngOnInit() {
  }

  createTeam(){
    this.showCreate=true;
  }

  getUsers(){
    this.data_service.getUsers().subscribe((response:any) =>{  
      this.users=response.users;
  }, error =>{
      this.isError = true;   
      window.scrollTo(0, 0);
    this.errorsArr = JSON.parse(error._body);
    this.toastr.errorToastr(this.errorsArr, 'Error!');
    console.log(JSON.stringify(this.errorsArr, undefined, 2))
  })
  }

  addUser(id){
    var index = this.usersId.findIndex(x => x == id)

    if (index === -1) {
      this.usersId.push(id);
    }else {
      console.log("object already exists")
      for (var i = 0; i < this.usersId.length; i ++) {
        if (this.usersId[i] === id) { 
            this.usersId.splice(i, 1);
            break;
        }
      }
    }
    this.selectedButton[id]= !this.selectedButton[id];
    console.log(this.usersId);
  }

  continue(){
   var sdfsdf = this.createTeamForm.value;
   if (/\S/.test(sdfsdf.name)) {
      this.hide=false;
      this.IsContinue =true;
      this.getUsers();
   }
   if (this.createTeamForm.invalid) {
        this.Isrequired=true;
        return;
    }
    this.hide=false;
    this.IsContinue =true;
    this.completed=true;
    this.getUsers();
  }

  back(){
    this.hide=true;
    this.IsContinue=false;
    this.createTeamForm.reset();
    this.completed=false;
  }
  back1(){
      this.showCreate=false;
    }
  TeamSubmit(){
    let data=this.createTeamForm.value;

    this.submitted = true; 
    
    if(this.usersId.length == 0) {
        this.selectUser = true;
        this.validationMessage  = 'Please select atleast one member to team.';
        this.toastr.errorToastr(this.validationMessage, 'Error!');
        return;
    }
    else{ 
      const input_data = { 
       "name" : data.name.trim(), 
       "userId" : this.usersId,
      } 
      console.log(input_data);
      this.data_service.createTeam(input_data).subscribe((response: any) =>{
          this.toastr.successToastr('Team Created Successfully.', 'Success!');
          this.createTeamForm.reset();
          this.showCreate=false;
          this.IsContinue =false;
          this.usersId=[];    
      },
      error =>{console.log(error)}) 
    }     
  }

}
