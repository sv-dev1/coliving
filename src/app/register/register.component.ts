import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

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
  
  constructor(	
        private formBuilder:FormBuilder,	
        private router: Router,
        private data_service : DataService,
        public toastr: ToastrManager
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
    });
  }

  ngOnInit() {
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
       console.log('form_data',form);
      const input_data = {
        "firstName" : form.firstName,
        "lastName" : form.lastName,      
        "username" : form.userName,
        "email" : form.email,
        "password" : form.password,
        "password2" : form.confPassword,
        "phoneNo": form.phoneNumber,
        "used_code":form.used_code,
        "roleId" :4    

      }
      console.log('input_data',input_data);
      this.data_service.register(input_data).subscribe((response:any) =>{  
           console.log(JSON.stringify(response, undefined, 2));  
          this.toastr.successToastr('Registered Successfully.', 'Success!');
          this.router.navigate(['/login']); 
          this.isError = false;
          this.isSuccess = true;   
      }, error =>{
         this.isError = true;   
         window.scrollTo(0, 0);
        this.errorsArr = JSON.parse(error._body);
        this.toastr.errorToastr(this.errorsArr, 'Error!');
        console.log(JSON.stringify(this.errorsArr, undefined, 2))
      })

    }
  }
}
