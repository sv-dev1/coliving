import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import { first } from 'rxjs/operators';

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
	stayDateEmpty:boolean=false;
	stay_date: any;
	wakeup_time:any;
	Dtime:any;

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
            console.log('this.userDataArr',this.userDataArr);
			let finalData;	
			if(this.userDataArr.stay_date != 'Invalid date'){
			
				let str = this.userDataArr.stay_date; 
				let splitted = str.split(" - ", 2); 	
				finalData = this.datePipe.transform(splitted[0],"MM/dd/yyyy")+" - "+this.datePipe.transform(splitted[1],"MM/dd/yyyy");
			}
			let wakeUpStr = this.userDataArr.wakeup_time; 
			   if(wakeUpStr) {
					let wakeSplit = wakeUpStr.split(":", 3); 
					let hours = wakeSplit[0];
					let minutes = wakeSplit[1];
     				const sfdsfsfs = {
						hour :parseInt(hours),
						minute : parseInt(minutes)
					}
				    this.time = sfdsfsfs;
			   } else {
				   this.time = this.time;
			   }
			   console.log('stay date',finalData);
			    console.log('wake up',this.time);
			this.image_url = this.image_base_url+''+this.userDataArr.userId;
			this.updateProfileForm.patchValue({
				firstName: this.userDataArr.firstName,
				lastName: this.userDataArr.lastName,
				email: this.userDataArr.email,
				userName: sessionStorage.getItem('user_name'),
				dob: this.datePipe.transform(this.userDataArr.dob,"MM/dd/yyyy"),
				occuptation_tt:this.userDataArr.occuptation_tt,
				wakeup_time:this.time,
				outing_day:this.datePipe.transform(this.userDataArr.outing_day,"MM/dd/yyyy"),
				price_range:this.userDataArr.price_range,
				stay_date:finalData,
				gender:this.userDataArr.gender,
				phoneNo: this.userDataArr.phoneNo,
				address: this.userDataArr.address,
				work_place:this.userDataArr.work_place,
				postalCode: this.userDataArr.postalCode,
				country: this.userDataArr.country,
				languages:'',
				nationality:'',
				biography:this.userDataArr.biography,
				interestes:this.userDataArr.interestes,
				habits:this.userDataArr.habits,
				previous_city:['atlanta'],
				image:['']
			});
			this.email = this.userDataArr.email;
			//console.log(this.updateProfileForm.value);
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
				classes:"myclass custom-class",
				limitSelection: 2

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
				classes:"myclass custom-class",
				limitSelection: 2
				
			};
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
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

	get f() {  
		return this.updateProfileForm.controls; 
	}
    checkLength(length){
    	console.log('check length',length);
    }

    onLanguageSelect(item:any){
    this.languageArr.push(item['id']);
        if(this.languageArr.length == 2){
        	this.toastr.infoToastr('You can select atmost two languages.');
        }
    }
    onNationalitySelect(item:any){
    this.nationalityArr.push(item['id']);
        if(this.nationalityArr.length == 2){
        	this.toastr.infoToastr('You can select atmost two nationalities.');
        }
    }

	updateProfile(formValue) {
		
		if(formValue.stay_date==""){
			this.stayDateEmpty=true;
		}
		if(formValue.languages  ==""){
			this.languageEmpty=true;
		}
		if(formValue.nationality ==""){
			this.nationalityEmpty=true;
		}
		if(formValue.country==""){
			this.countryEmpty=true;
		}
		if(formValue.stay_date){
			this.stay_date = this.datePipe.transform(formValue.stay_date[0],"yyyy-MM-dd")+" - "+this.datePipe.transform(formValue.stay_date[1],"yyyy-MM-dd")
		}
		if(formValue.wakeup_time){
			this.wakeup_time = formValue.wakeup_time.hour+":"+formValue.wakeup_time.minute;
		}
		
       
		this.submitted = true;
		if(this.updateProfileForm.invalid) {
			return;
        
		} else {

			const formData = new FormData();
			formData.append('firstName', formValue.firstName);
			formData.append('lastName', formValue.lastName);
			formData.append('email', formValue.email);	 	   
			formData.append('upload_photo', this.fileData);
			formData.append('phoneNo', formValue.phoneNo);
			formData.append('postalCode', formValue.postalCode);   
			formData.append('country', formValue.country);
			formData.append('address', formValue.address); 
			formData.append('biography', formValue.biography); 
			formData.append('dob', this.datePipe.transform(formValue.dob,"yyyy-MM-dd")); 
			formData.append('gender', formValue.gender); 
			formData.append('habits', formValue.habits); 
			formData.append('interestes', formValue.interestes); 
			formData.append('languages', this.languageArr); 
			formData.append('nationality',this.nationalityArr); 
			formData.append('occuptation_tt', formValue.occuptation_tt); 
			formData.append('outing_day', this.datePipe.transform(formValue.outing_day,"yyyy-MM-dd")); 
			formData.append('price_range', formValue.price_range); 
			formData.append('stay_date', this.stay_date); 
			formData.append('wakeup_time', this.wakeup_time); 
			formData.append('work_place', formValue.work_place); 
			formData.append('previous_city', formValue.previous_city); 

			let token; 
            if(sessionStorage.getItem("auth_token")!=undefined){
            token = sessionStorage.getItem("auth_token"); 
            }
            const httpOptions = { headers: new HttpHeaders({'authorization': token })};
            this.http.put(this.base_url+'user/profile', formData, httpOptions).subscribe((response:any) => {
				console.log('response', response);
				this.toastr.successToastr(response.message,'Success');
				this.submitted = false;
				this.getUserData();

			},error =>{
				this.isError = true;
				console.log('errors',error); 
				this.errorsArr = error.error;

			});
		}
	}
























	
	updateProfile11(formValue){
		if(this.updateProfileForm.invalid) {
			return;
		} else {
			if(this.updateProfileForm.value['language']==""){
				this.languageEmpty=true;
			}
			if(this.updateProfileForm.value['nationality']==""){
				this.nationalityEmpty=true;
			}
			if(this.updateProfileForm.value['country']==""){
				this.countryEmpty=true;
			}
			if(this.updateProfileForm.value['stay_date']){
				this.updateProfileForm.value['stay_date']=this.datePipe.transform(this.updateProfileForm.value['stay_date'][0],"MM/dd/yyyy")+" - "+this.datePipe.transform(this.updateProfileForm.value['stay_date'][1],"MM/dd/yyyy")
			}
			if(this.updateProfileForm.value['wakeup_time']){
				this.updateProfileForm.value['wakeup_time']=this.updateProfileForm.value['wakeup_time'].hour+":"+this.updateProfileForm.value['wakeup_time'].minute;
			} 
			if(this.nationalityArr.length > '2'){
				this.atmostTwoValNat = true;
				return;
			}
			if(this.languageArr.length > '2'){
				this.atmostTwoValLang = true;
				return;
			}
			this.nationalityArr.push(formValue.nationality);
			this.languageArr.push(formValue.languages);


			const formData = new FormData();
			formData.append('firstName', formValue.firstName);
			formData.append('lastName', formValue.lastName);
			formData.append('email', formValue.email);	 	   
			formData.append('upload_photo', this.fileData);
			formData.append('phoneNo', formValue.phoneNo);
			formData.append('postalCode', formValue.postalCode);   
			formData.append('country', formValue.country);
			formData.append('address', formValue.address); 
			formData.append('biography', formValue.biography); 
			formData.append('dob', formValue.dob); 
			formData.append('gender', formValue.gender); 
			formData.append('habits', formValue.habits); 
			formData.append('interestes', formValue.interestes); 
			formData.append('languages', formValue.languages); 
			formData.append('nationality',formValue.nationality); 
			formData.append('occuptation_tt', formValue.occuptation_tt); 
			formData.append('outing_day', formValue.outing_day); 
			formData.append('price_range', formValue.price_range); 
			formData.append('stay_date', formValue.stay_date); 
			formData.append('wakeup_time', formValue.wakeup_time); 
			formData.append('work_place', formValue.work_place); 
			formData.append('previous_city', formValue.previous_city); 

			this.data_service.upDateProfile(formData).subscribe((response:any) =>{
				console.log(response);
				this.toastr.successToastr('Profile Updated Successfully.', 'Success!');
				//	this.getUserData();
			}, error =>{ 
				console.log(error);
			})
		}
		
	}


	
}
