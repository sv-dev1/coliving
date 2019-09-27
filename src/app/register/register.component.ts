import { Component, OnInit } from '@angular/core';
import {  Router, } from '@angular/router';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

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
  private rc: string;

  constructor(	
        private formBuilder:FormBuilder,	
        private router: Router,
        private data_service : DataService,
        public toastr: ToastrManager,
        private route: ActivatedRoute
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
    });
    
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

  register(form){

    console.log("working here");
    this.submitted = true;
    if (this.registerForm.invalid) {
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
        console.log('after register response',response);
              this.toastr.successToastr('Registered Successfully.', 'Success!');
              this.router.navigate(['/login']); 
              this.isError = false;
              this.isSuccess = true;            
      }, error =>{
         this.isError = true;   
         window.scrollTo(0, 0);
        this.errorsArr = error.error.username;
        this.toastr.errorToastr(this.errorsArr, 'Error!');
        //console.log('dffsdfsd',JSON.stringify(this.errorsArr, undefined, 2))
      })

    }
  }
}
