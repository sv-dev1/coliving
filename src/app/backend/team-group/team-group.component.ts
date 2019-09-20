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

  constructor(
    private formBuilder:FormBuilder,	
    private router: Router,
    private data_service : DataService,
    public toastr: ToastrManager
  ) { 
    this.createTeamForm = this.formBuilder.group({
      name:[''],
    });
  }
  ngOnInit() {
    this.getUsers();
  }

  createTeam(){
    this.showCreate=true
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
   this.usersId.push(id);
}
  TeamSubmit(){
    let data=this.createTeamForm.value;
    this.submitted = true; 
    if (this.createTeamForm.invalid) {
      return;
    }
    else{ 
      const input_data = { 
       "name" : data.name, 
        "userId" : this.usersId,
      } 
      this.data_service.createTeam(input_data).subscribe((response: any) =>{
          this.toastr.successToastr('Team Created Successfully.', 'Success!');
          this.createTeamForm.reset();
      },
      error =>{console.log(error)}) 
    }     
  }

}
