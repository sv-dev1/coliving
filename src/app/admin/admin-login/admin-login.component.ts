import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AuthService } from "angularx-social-login";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  
  loginForm: FormGroup;
  submitted = false; 
  fagree =false;
  msg = ''; 
  isError : boolean = false;
  isSuccess : boolean = false;
  errorsArr:any = []; 
  returnUrl: string;
  res:any = [];
  userInfo:any =[];

  constructor(
        private formBuilder:FormBuilder,	
  	    private router: Router,
  	    private data_service : DataService,
  	    public toastr: ToastrManager,
  	    private authService: AuthService
  	) {

       this.loginForm = this.formBuilder.group({
     		username: ['', [Validators.required]],
     		password: ['', [Validators.required]]
        });
  	 }

  ngOnInit() {
  }
   

  get f() { return this.loginForm.controls; }

  login(form) { 
    //console.log('test');
    this.submitted = true;
    if (this.loginForm.invalid) {
      console.log('dasd');
      return;
    } else {
      //console.log('Invalid'); 
      const input_data = { 
        "username" : form.username,
        "password" : form.password, 		
      }
      this.data_service.login(input_data).subscribe((response:any) =>{
        if(response.roleId == '1') {
            this.res = JSON.stringify(response, undefined, 2); 
            console.log('response', response);
            sessionStorage.setItem("roleId", response.roleId);
            sessionStorage.setItem("auth_token", response.token);
            sessionStorage.setItem("user_name", response.username);
            sessionStorage.setItem("userId", response.userId);
            this.toastr.successToastr('You are logged in successfully!');
            this.router.navigate(['/admin/dashboard']);  
            this.isError = false;
        } else  {
            this.toastr.errorToastr('Invalid Access!');
        }   
      }, error =>{ 
        this.isError = true; 
      //  this.toastr.errorToastr('Invalid Credentials','Error');
      })
    }
  } 
}
