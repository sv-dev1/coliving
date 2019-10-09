import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-my-account',
	templateUrl: './my-account.component.html',
	styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
	msg = ''; 
	isError : boolean = false;
	isSuccess : boolean = false;
	errorsArr:any = []; 
	newArray : any = [];
	profileData : any = [];

	updateProfileForm: FormGroup;
	image_base_url :any;
	image_url:any;
	submitted = false;
	base_url :any;
	fileData:any;
	url:any;
	userDataArr:any;
	email:any;
    messageDigit:string='';
    messageDigit1:string='';
    time = {hour: 13, minute: 30};
    today:any;
    teamEmpty:boolean=false;
    userEmpty:boolean=false;
    allCountriesArray:any=[];
    allCountries:any=[];
    allLanguagesArray:any=[];
    allLanguages:any=[];

    countrydropdownList:any = [];
    langdropdownList:any  = [];
    dropdownSettingsCountry  =  {}
    dropdownSettingsLanguage =  {}
    nationalityArr: any = [];
    languageArr: any=[];
    atmostTwoValNat:boolean=false;
    atmostTwoValLang:boolean=false;
    countryEmpty:boolean=false;
    languageEmpty:boolean=false;
    nationalityEmpty:boolean=false;

	constructor(
		private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient,
		calendar: NgbCalendar
		) {   
		  
		this.updateProfileForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', Validators.required],
			userName: ['', Validators.required],
			phoneNumber: ['', Validators.required],
			postalCode: ['', [Validators.required, Validators.maxLength(6)]],
			country: ['', Validators.required],
			address: ['', Validators.required],
			image:[''],
			file:[''],
			dob:['', Validators.required],
			occupation:['', Validators.required],
			price:['', Validators.required],
            getUptime:['', Validators.required],
            inOut:['', Validators.required],
            willingToStay:['', Validators.required],
			gender:['', Validators.required],
			short_bio:['', Validators.required],
			interests:['', Validators.required],
			habits:['', Validators.required],
			language:['', Validators.required],
			nationality:['', Validators.required],
			workPlace:['', Validators.required],
		});
		this.today = new Date();
		this.base_url = environment.base_url;
		this.image_base_url = environment.image_base_url;
	}
  
	ngOnInit() {
		this.getUserData();
		this.getAllCountries();
		this.getAllLanguages();
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
			console.log('user data',this.userDataArr);
			this.image_url = this.image_base_url+''+this.userDataArr.userId;
			this.updateProfileForm.patchValue({
				firstName : this.userDataArr.firstName,
				lastName : this.userDataArr.lastName,
				email : this.userDataArr.email,
				userName : sessionStorage.getItem('user_name'),
				phoneNumber : this.userDataArr.phoneNo,
				postalCode : this.userDataArr.postalCode,
				address : this.userDataArr.address,
				country : this.userDataArr.country,
                short_bio: this.userDataArr.biography,
                dob: this.userDataArr.dob,
                gender: this.userDataArr.gender,
                habits: this.userDataArr.habits,
                interests: this.userDataArr.interestes,
                languages: this.userDataArr.languages,
                nationality: this.userDataArr.nationality,
                occuptation_tt: this.userDataArr.occuptation_tt,
                outing_day: this.userDataArr.outing_day,
                price_range: this.userDataArr.price_range,
                stay_date: this.userDataArr.stay_date,
                wakeup_time: this.userDataArr.wakeup_time,
                workPlace: this.userDataArr.work_place,

			});
			this.email = this.userDataArr.email;	
		},error=>{ 
			console.log("ERROR");
			console.log(error.error);
		});  
	}
	getAllCountries(){
	     this.data_service.getCountries().subscribe((response:any) =>{   
			this.allCountriesArray = response.countries;
			this.allCountries = this.allCountriesArray;
			this.allCountries.forEach(ele => {
	            let obj = {};
	            obj['id'] = ele['id'];
	            obj['itemName'] = ele['name'];
	            this.countrydropdownList.push(obj);
            });
			this.dropdownSettingsCountry = { 
	             singleSelection: false, 
	             text:"Select Nationality",
	             selectAllText:'Select only two items.',
	             unSelectAllText:'UnSelect All',
	             classes:"myclass custom-class"
            };
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	getAllLanguages(){
	     this.data_service.getLanguages().subscribe((response:any) =>{
			this.allLanguagesArray = response.languages;
			this.allLanguages = this.allLanguagesArray;
			this.allLanguages.forEach(ele => {
	            let obj = {};
	            obj['id'] = ele['id'];
	            obj['itemName'] = ele['name'];
	            this.langdropdownList.push(obj);
            });
			this.dropdownSettingsLanguage = { 
	             singleSelection: false, 
	             text:"Select Languages",
	             selectAllText:'Select only two items.',
	             unSelectAllText:'UnSelect All',
	             classes:"myclass custom-class"
            };
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	get f() {  
		return this.updateProfileForm.controls; 
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
	keyPress(event: any) {
	this.messageDigit1 ='';
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    // console.log(inputChar, e.charCode);
       if (!pattern.test(inputChar)) {
         this.messageDigit = 'Only digit allowed.';
           event.preventDefault();
      }
    }
    keyPress1(event: any) {
    this.messageDigit ='';
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    // console.log(inputChar, e.charCode);
       if (!pattern.test(inputChar)) {
         this.messageDigit1 = 'Only digit allowed.';
           event.preventDefault();
      }
    }
	updateProfile(form){
	    console.log('form value',form);
		if(this.updateProfileForm.value['language']==""){
	         this.languageEmpty=true;
	      }
	      if(this.updateProfileForm.value['nationality']==""){
	         this.nationalityEmpty=true;
	      }
	      if(this.updateProfileForm.value['country']==""){
	         this.countryEmpty=true;
	      }
	    
		this.submitted = true;  
		if (this.updateProfileForm.invalid) {
			return;
		} else {  
            form.nationality.forEach(element => {
                this.nationalityArr.push(element.id);
            });
		    form.language.forEach(element => {
		          this.languageArr.push(element.id);
		     });
		     if(this.nationalityArr.length > '2'){
		           this.atmostTwoValNat = true;
		      }
		     if(this.languageArr.length > '2'){
		           this.atmostTwoValLang = true;
		     }
			const input_data = { 
				"first_name" : form.firstName, 
				"last_name" : form.lastName,
				"email" : form.email,
				"upload_photo" : this.fileData,
				"phoneNo" : form.phoneNumber,
				"postalCode" : form.postalCode,
				"country" : form.country,
				"address" : form.address,
                "biography":form.short_bio,
                "dob":form.dob,
                "gender":form.gender,
                "habits":form.habits,
                "interestes":form.interests,
                "languages":this.languageArr,
                "nationality":this.nationalityArr,
                "occuptation_tt":form.occupation,
                "outing_day":form.inOut,
                "price_range":form.price,
                "stay_date":form.willingToStay,
                "wakeup_time":form.getUptime,
                "work_place":form.workPlace

			} 
			
			const formData = new FormData();
			formData.append('firstName', input_data.first_name);
			formData.append('lastName', input_data.last_name);
			formData.append('email', input_data.email);	 	   
			formData.append('upload_photo', this.fileData);
			formData.append('phoneNo', input_data.phoneNo);
			formData.append('postal_code', input_data.postalCode);   
			formData.append('country', input_data.country);
			formData.append('address', input_data.address); 
			formData.append('biography', input_data.biography); 
			formData.append('dob', input_data.dob); 
			formData.append('gender', input_data.gender); 
			formData.append('habits', input_data.habits); 
			formData.append('interestes', input_data.interestes); 
			formData.append('languages', input_data.languages); 
			formData.append('nationality', input_data.nationality); 
			formData.append('occuptation_tt', input_data.occuptation_tt); 
			formData.append('outing_day', input_data.outing_day); 
			formData.append('price_range', input_data.price_range); 
			formData.append('stay_date', input_data.stay_date); 
			formData.append('wakeup_time', input_data.wakeup_time); 
			formData.append('work_place', input_data.work_place); 
          
			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.put(this.base_url+'user/profile', formData, httpOptions).subscribe((response:any) => {
				console.log('response response',); 
				this.toastr.successToastr(response.message, 'Success!');			
				this.updateProfileForm.reset();
				this.router.navigate(['/dashboard']);
				this.isError = false;
				this.isSuccess = true;  	
			},error=>{ 
				console.log('response error', error);
				this.toastr.errorToastr(error.error, 'Error!');
			});   
		}
	}

}
