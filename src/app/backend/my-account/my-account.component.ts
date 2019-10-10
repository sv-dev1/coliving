import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';


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
		calendar: NgbCalendar,
		private datePipe: DatePipe
		) {   
		  
		this.updateProfileForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', Validators.required],
			userName: ['', Validators.required],
	   		dob:['', Validators.required],
			occuptation_tt:['', Validators.required],
            wakeup_time:['', Validators.required],
			outing_day:['', Validators.required],
		    price_range:['', Validators.required],
			stay_date:['', Validators.required],
			gender:['', Validators.required],
			phoneNo: ['', Validators.required],
			address: ['', Validators.required],
			work_place:['', Validators.required],
			postalCode: ['', [Validators.required, Validators.maxLength(6)]],
			country: ['', Validators.required],
			languages:['', Validators.required],
			nationality:['', Validators.required],
			biography:['', Validators.required],
			interestes:['', Validators.required],
			habits:['', Validators.required],
			image:[''],
			file:[''],
			previous_city:['atlanta']
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
			//console.log('user data',this.userDataArr);
			this.image_url = this.image_base_url+''+this.userDataArr.userId;
			this.updateProfileForm= this.formBuilder.group({
				firstName: this.userDataArr.firstName,
				lastName: this.userDataArr.lastName,
				email: this.userDataArr.email,
				userName: sessionStorage.getItem('user_name'),
				dob:this.userDataArr.dob,
				occuptation_tt:this.userDataArr.occuptation_tt,
				wakeup_time:this.userDataArr.wakeup_time,
				outing_day:this.userDataArr.outing_day,
				price_range:this.userDataArr.price_range,
				stay_date:this.userDataArr.stay_date,
				gender:this.userDataArr.gender,
				phoneNo: this.userDataArr.phoneNo,
				address: this.userDataArr.address,
				work_place:this.userDataArr.work_place,
				postalCode: this.userDataArr.postalCode,
				country: this.userDataArr.country,
				languages:[''],
			 	nationality:[''],
				biography:this.userDataArr.biography,
				interestes:this.userDataArr.interestes,
				habits:this.userDataArr.habits,
				image:[''],
				file:[''],
				previous_city:['atlanta']
			});
			this.email = this.userDataArr.email;
			this.fileData=	this.userDataArr.image;
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
            console.log(inputChar, event.charCode);
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
	
	updateProfile(){

		if(this.updateProfileForm.value['language']==""){
	         this.languageEmpty=true;
	    }
	    if(this.updateProfileForm.value['nationality']==""){
	        this.nationalityEmpty=true;
	    }
	    if(this.updateProfileForm.value['country']==""){
	         this.countryEmpty=true;
		}
		// if(this.updateProfileForm.value['wakeup_time']){
		// 	this.updateProfileForm.value['wakeup_time']=this.updateProfileForm.value['wakeup_time'].hour+":"+this.updateProfileForm.value['wakeup_time'].minute;
  	    // }
		// if(this.updateProfileForm.value['stay_date']){
		// 		this.updateProfileForm.value['stay_date']=this.datePipe.transform(this.updateProfileForm.value['stay_date'][0],"dd/MM/yyyy")+"-"+this.datePipe.transform(this.updateProfileForm.value['stay_date'][1],"dd/MM/yyyy")
		// }
		// if(this.updateProfileForm.value['outing_day']){
		// 	this.updateProfileForm.value['outing_day']=this.datePipe.transform(this.updateProfileForm.value['outing_day'],"yyyy-MM-dd")
		// }
		// if(this.updateProfileForm.value['dob']){
		// 	this.updateProfileForm.value['dob']=this.datePipe.transform(this.updateProfileForm.value['dob'],"yyyy-MM-dd")
		// }
		  
		this.submitted = true;  
		let dataObj=this.updateProfileForm.value;
	
		//   console.log(dataObj.languages);
		//   console.log(dataObj.nationality);
            console.log(this.fileData);
		 if(this.nationalityArr.length > '2'){
			   this.atmostTwoValNat = true;
		  }
		 if(this.languageArr.length > '2'){
			   this.atmostTwoValLang = true;
		 }
		this.nationalityArr.push(dataObj.nationality);
		this.languageArr.push(dataObj.languages);

		const formData = new FormData();
			formData.append('firstName', dataObj.firstName);
			formData.append('lastName', dataObj.lastName);
			formData.append('email', dataObj.email);	 	   
			formData.append('image', this.fileData.name);
			formData.append('phoneNo', dataObj.phoneNo);
			formData.append('postalCode', dataObj.postalCode);   
			formData.append('country', dataObj.country);
			formData.append('address', dataObj.address); 
			formData.append('biography', dataObj.biography); 
			formData.append('dob', dataObj.dob); 
			formData.append('gender', dataObj.gender); 
			formData.append('habits', dataObj.habits); 
			formData.append('interestes', dataObj.interestes); 
			formData.append('languages', dataObj.languages); 
			formData.append('nationality',dataObj.nationality); 
			formData.append('occuptation_tt', dataObj.occuptation_tt); 
			formData.append('outing_day', dataObj.outing_day); 
			formData.append('price_range', dataObj.price_range); 
			formData.append('stay_date', dataObj.stay_date); 
			formData.append('wakeup_time', dataObj.wakeup_time); 
			formData.append('work_place', dataObj.work_place); 
			formData.append('previous_city', dataObj.previous_city); 

		this.data_service.upDateProfile(formData).subscribe((response:any) =>{

			console.log(response);
			this.toastr.successToastr('Profile Updated Successfully.', 'Success!');

		}, error =>{ 
			console.log(error);

		})
	}


	
}
