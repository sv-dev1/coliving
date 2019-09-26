import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AuthService} from '../auth.service';
import { SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false; 
  fagree =false;
  msg = ''; 
  isError : boolean = false;
  isSuccess : boolean = false;
  errorsArr:any = []; 
  returnUrl: string;
  res:any = [];
  user: SocialUser;

  constructor(
    private formBuilder:FormBuilder,	
    private router: Router,
    private data_service : DataService,
    private authService: AuthService,
    public toastr: ToastrManager) 
  { 
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });     
    if(sessionStorage.getItem("auth_token") != undefined){
     this.router.navigate(['/dashboard']);
    }
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
      //console.log(input_data);
      this.data_service.login(input_data).subscribe((response:any) =>{
       // console.log('asdasdsadsa',JSON.stringify(response, undefined, 2));
        //console.log('token after login', response);
        this.res = JSON.stringify(response, undefined, 2); 
        sessionStorage.setItem("auth_token", response.token);
        this.toastr.successToastr('You are logged in successfully!', 'Hello,');
        this.router.navigate(['/dashboard']);  
        this.isError = false;
        
      }, error =>{ 
        //console.log('errrror',error);
        this.isError = true; 
        //this.errorsArr = error.error.username;
        this.toastr.errorToastr('Invalid Credentials','Error');
        //console.log(JSON.stringify(this.errorsArr, undefined, 2))
      })
    }
  } 

  signInWithFb() {
    this.authService.signInWithFacebook()
    .then((res) => { 
        this.router.navigate(['dashboard'])
      })
    .catch((err) => console.log(err)); 
   }

  signInWithTwitter(){
    console.log("TwitterClicked");
   // this.authService.signIn
  }
  signInWithGoogle(){
    this.authService.signInWithGoogle()
    .then((res) => { 
        this.router.navigate(['dashboard'])
      })
    .catch((err) => console.log(err)); 
   }
}
