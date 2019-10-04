import { Component, OnInit, HostListener } from '@angular/core';
import {  Router, } from '@angular/router';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { ConfirmPasswordValidator } from '../helpers/confirm-password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false; 
  fagree =false;
  msg = ''; 
  isError : boolean = false;
  isSuccess : boolean = false;
  errorsArr:any = [];
  errorsArrUser:any =[]; 
  private rc: string;
  res:any = [];
  messageDigit:string='';
  color : string='green';
  child : boolean=true;
messahecczcz:string='';
  
  constructor(	
    private formBuilder:FormBuilder,	
    private router: Router,
    private data_service : DataService,
    public toastr: ToastrManager,
    private route: ActivatedRoute,
    private authService: AuthService
    ) { 
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confPassword: ['', [Validators.required, Validators.minLength(8)]],
      phoneNumber:['', [Validators.required, Validators.minLength(8),Validators.maxLength(15)]],
      agree: ['false', Validators.requiredTrue],
      referralCode: ['']
    },{
      validator: ConfirmPasswordValidator.MatchPassword
    }
    );
    
  } 

  ngOnInit() {
    const referralCode: string = this.route.snapshot.queryParamMap.get('rc');
    if(referralCode) {
      this.registerForm.patchValue({
        referralCode : referralCode,
      });  
    }
  }
 
  get f() {  
    return this.registerForm.controls; 
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    // console.log(inputChar, e.charCode);
    if (!pattern.test(inputChar)) {
      this.messageDigit = 'Only digit allowed.';
      event.preventDefault();
    }
  }
  register(form){

    console.log("working here");
    this.submitted = true;
    if (this.registerForm.invalid) {
      console.log("error");
      return;
    }else{

      const input_data = {
        "firstName" : form.firstName,
        "lastName" : form.lastName,      
        "username" : form.userName,
        "email" : form.email,
        "password" : form.password,
        "password2" : form.confPassword,
        "phoneNo": form.phoneNumber,
        "ref_code":form.referralCode,
        "roleId" :4    
      }
      
      this.data_service.register(input_data).subscribe((response:any) =>{  
        this.toastr.successToastr('Registered Successfully.', 'Success!');
        this.router.navigate(['/login']); 
        this.isError = false;
        this.isSuccess = true;            
      }, error =>{
        this.isError = true;   
         window.scrollTo(0, 0);
         console.log('errror',error);
         this.errorsArrUser = error.error.username;
         //this.toastr.errorToastr(this.errorsArr, 'Error!');
        //console.log('dffsdfsd',JSON.stringify(this.errorsArr, undefined, 2))
      })

    }
  }
  signInWithFb(): void {
    console.log("fb");

    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => {console.log(x)
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
}
