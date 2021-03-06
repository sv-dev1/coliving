import { Component, OnInit, ComponentFactoryResolver, NgZone } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
//import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import {  AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

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
  userInfo:any =[];
  private user: SocialUser;
  private loggedIn: boolean;
  session_key: boolean;

  constructor(
    private zone: NgZone,
    private formBuilder:FormBuilder,	
    private router: Router,
    private data_service : DataService,
    public toastr: ToastrManager,
    public afAuth: AngularFireAuth,

    private authService: AuthService) 
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
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
     
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
        //console.log('response',response.token);
        if(response.roleId == '3') {
            this.res = JSON.stringify(response, undefined, 2); 
            
            sessionStorage.setItem("roleId", response.roleId);
            sessionStorage.setItem("auth_token", response.token);
            sessionStorage.setItem("user_name", response.username);
            sessionStorage.setItem("userId", response.userId);
            this.toastr.successToastr('You are logged in successfully!');
            this.router.navigate(['/dashboard']);  
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


  signInWithFb(): void {
    console.log("fb");
    //return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(res => {
        localStorage.setItem("user_email", res.user.email);
        var data = {
          "username" : res.user.email,
          "password" : "", 		
        }
        console.log(JSON.stringify(data, undefined, 2));
        this.data_service.login(data).subscribe((response: any)=>{
          if(response['roleId'] == '3') {
            this.res = JSON.stringify(response, undefined, 2); 
            console.log('response', response);
            sessionStorage.setItem("roleId", response.roleId);
            sessionStorage.setItem("auth_token", response.token);
            sessionStorage.setItem("user_name", response.username);
            sessionStorage.setItem("userId", response.userId);
            this.toastr.successToastr('You are logged in successfully!');
            this.router.navigate(['/dashboard']);  
            this.isError = false;
        } else  {
            this.toastr.errorToastr('Invalid Access!');
        }
        //resolve(res);
      }, err => {
        //reject(err);
      })
    })
    //});      
  } 


  signInWithTwitter(){
    console.log("twitter");
  }
  signInWithGoogle(): void {
    console.log("google");
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => {
      console.log(x);
      const input_data = {
        "firstName" : x.firstName,
        "lastName" : x.lastName,      
        "username" : x.firstName + 12,
        "email" : x.email,
        "password" : x.firstName+'@123',
        "password2" : x.firstName+'@123',
        "phoneNo": "0000000000",
        "ref_code": "0000000",
        "roleId" :4    
      }
      this.data_service.register(input_data).subscribe((response:any) =>{
        console.log('after register response');
        console.log(response);
        sessionStorage.setItem("auth_token", response.token);
            location.href = "/dashboard"; 
      }, error =>{
         window.scrollTo(0, 0);
        if(error.error.username){
          this.errorsArr = error.error.username;
          const input_data = { 
            "username" : x.firstName + 12,
            "password" :x.firstName+'@123',		
          }
          this.data_service.login(input_data).subscribe((response:any) =>{
            this.res = JSON.stringify(response, undefined, 2); 
            sessionStorage.setItem("auth_token", response.token);
            sessionStorage.setItem("user_name", response.username);
            this.toastr.successToastr('You are logged in successfully!');
            this.router.navigate(['/dashboard']);  
          }, error =>{ 
            this.isError = true; 
        //    this.toastr.errorToastr('Invalid Credentials','Error');
          })
       }
    })
  });
   
  }
  signOut(): void {
    this.authService.signOut();
  }
}
