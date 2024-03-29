import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';
import { MustMatch } from '../../../helpers/must-match.validator';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  session_key : boolean = false;
  msg = ''; 
  isError : boolean = false;
  isSuccess : boolean = false;
  errorsArr:any = []; 
  newArray : any = [];
  profileData : any = [];
  userDataArr : any =[];
  image_url : string = "";
  image_base_url : any;
  base_url : any;
  images : string = "";
  isChangePassword: boolean = false;
  ConPass : FormGroup;
  submitted : boolean =false;
  firstName :string='';
  lastName : string='';
  status : boolean = false;
  badgeNumber : number;
  response : any ;
  roleId : string = '';
  public innerWidth: any;
  isLandlord : boolean = false;

  constructor(
        private router: Router,
        public toastr: ToastrManager,
        private data_service : DataService,
        private http : HttpClient,
        private formBuilder:FormBuilder
    ) {
        this.base_url = environment.base_url;
        this.image_base_url = environment.image_base_url;
        this.ConPass = this.formBuilder.group({       
            cuPass:['', [Validators.required, Validators.minLength(6)]], 
            pwd: ['', [Validators.required, Validators.minLength(6)]],
             confirmPassword:['', Validators.required]      
        },{
              validator: MustMatch('pwd', 'confirmPassword')
        });
         this.innerWidth = window.innerWidth;
          if(this.innerWidth <=  1024) {
              const body = document.getElementsByTagName('body')[0];
              body.classList.add('custom-sidebar-hide-show');
          } else {
              const body = document.getElementsByTagName('body')[0];
              body.classList.remove('custom-sidebar-hide-show');
          }
     }

  ngOnInit() {
    if(sessionStorage.getItem("auth_token") != undefined){
      this.session_key = true;
      this.roleId = sessionStorage.getItem('roleId');
    } 
    this.getUserData();  
    this.badgeNumber = 2;
   
  }

  systemLogout($event){ 
   // console.log($event);
  	if(sessionStorage.getItem("auth_token") != undefined){
      this.session_key = false;
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("questionaire");
      sessionStorage.removeItem("user_name");

      this.toastr.successToastr('Logout Successfully!','Success',);
      this.router.navigate(['']);
    }
  }
 
  getUserData(){ 
   
    let token; 
    if(sessionStorage.getItem("auth_token")!=undefined){
      token = sessionStorage.getItem("auth_token"); 
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', token);
     this.http.get(this.base_url+'user/profile', { headers: headers }).subscribe((response: any) => {
      this.userDataArr = response.users[0]; 
      //console.log(this.userDataArr);
      this.image_url = this.image_base_url+''+this.userDataArr.userId;
      this.firstName = this.userDataArr.firstName;
      this.lastName = this.userDataArr.lastName;
    },error=>{ 
      //console.log("ERROR");
     // console.log(error.error);
      this.isError = true; 
      this.errorsArr = error.error;
    });  
  }
  get f() { return this.ConPass.controls; }

   onSubmit(form){
    this.submitted = true;
    if(this.ConPass.invalid) {
        return;
    }else{
      const input = {  
        "password": form.cuPass, 
        "newPassword": form.pwd,                
        "newPassword2": form.confirmPassword,
      } 
  
      console.log(input); 
       this.data_service.changePassword(input).subscribe((response:any)=> { 
          this.toastr.successToastr(response.message,'Success');
          this.isChangePassword = false;           
          this.ConPass.reset();
        },error =>{
          console.log(error);
        });

    }
  }
  changePasswordModal(){
    this.isChangePassword = true;
  }
  closeModal(){
    this.isChangePassword = false;
    this.submitted = false;     
    this.ConPass.reset();
  }
  toggleClassOnImageClick(event:any) {
 
      if(event == false) {
          this.status = true;
          const body = document.getElementsByTagName('body')[0];
          body.classList.add('custom-body-class');
      } else if(event ==true) {
          this.status = false;
          const body = document.getElementsByTagName('body')[0];
          body.classList.remove('custom-body-class');
      }
       
   }
   teamInfo(id :any){
     console.log(id);
    this.router.navigate(['/team-Info/'+id]);
   }
  
}
