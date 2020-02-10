import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http'; 
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import { first } from 'rxjs/operators';

import {GooglePlaceDirective} from "../../ngx-google-places-autocomplete.directive";
import {ComponentRestrictions} from "../../objects/options/componentRestrictions";
import {Address} from "../../objects/address";
import {AddressComponent} from "../../objects/addressComponent";

@Component({
	selector: 'app-my-account',
	templateUrl: './my-account.component.html',
	styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
      


	msg = ''; 
	isError : boolean = false;
	isSuccess : boolean = false;
	errorsArr : any = []; 
	newArray : any = [];
	profileData : any = [];
	updateProfileForm : FormGroup;
	image_base_url : any;
	image_url : any;
	submitted = false;
	base_url : any;
	fileData : any;
	url : any;
	userDataArr : any;
	email : any;
	messageDigit : string = '';
	messageDigit1 : string = '';
	time = {hour: 13, minute: 30};
	weekend_time = {hour: 13, minute: 30};
	today : any;
	teamEmpty : boolean=false;
	userEmpty : boolean=false;
	allCountriesArray : any = [];
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
	weekend_wakeup_time:any;
	Dtime:any;
	length:boolean=false;
	ip_address : string = "";
	current_country : string = "";
	nationalitySelectedItems = [];
	languageSelectedItems = [];
	languageArrMap : any = [];
	nationalityArrMap : any = [];
	maximumPrice: any = [];
    minimumPrice : any = [];
    selectedItemsNational: any;
    selectedItemsLanguage: any;
    countryCode: any;
    phoneNumber : any;
    maxPriceValue : any;
    minPriceValue : any;
    boolUrl : boolean = false;
    boolUserImage : boolean = false;

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
			maximunPrice:['', Validators.required],
			minimumPrice:['', Validators.required],
			stay_date:[''],
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
			social_account:[''],
			weekend_wakeup_time:['', Validators.required],
			previousCity:['', Validators.required],
			rentalDescription:['', Validators.required]
		});

		this.today = new Date();
		this.base_url = environment.base_url;
		this.image_base_url = environment.image_base_url;
	}

	ngOnInit() {
		this.getUserData();
		this.getAllCountries();
		this.getAllLanguages();
        this.getCurrentIP();
        if(sessionStorage.getItem("roleId") == '3' || sessionStorage.getItem("roleId") == '4'){
          this.router.navigate(['/dashboard']);
        }

		
	}

	getCurrentIP(){
	      this.http.get('https://jsonip.com').subscribe( data => {
	      this.ip_address = data['ip'];
	      this.getCurrentLoaction();
	    })
    }
    getCurrentLoaction(){
		this.data_service.currentLocation(this.ip_address).subscribe(response => { 
		this.current_country = response['country'].toLowerCase();

        },error => {
		console.log(error);
		})
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
				limitSelection: 2,
				enableSearchFilter: true,

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
				limitSelection: 2,
				enableSearchFilter: true,
			};
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
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
          
			let finalData;	
			
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
			let WeekendWakeUpStr = this.userDataArr.wakeup_time; 
			   if(WeekendWakeUpStr) {
					let wakeSplit = WeekendWakeUpStr.split(":", 3); 
					let hours = wakeSplit[0];
					let minutes = wakeSplit[1];
     				const sfdsfsfs = {
						hour :parseInt(hours),
						minute : parseInt(minutes)
					}
				    this.weekend_time = sfdsfsfs;
			   } else {
				   this.weekend_time = this.weekend_time;
			   }
			 
			   let price = this.userDataArr.price_range; 
			   if(price) {
			   	  let splitPrice = price.split("-", 3); 
			   	     this.maximumPrice = splitPrice[0];
					 this.minimumPrice = splitPrice[1];
			   }
               if(this.userDataArr.languages_map){

					var res = this.userDataArr.languages_map.replace(/&quot;/g,'"');
					if(res) {
						this.languageSelectedItems = JSON.parse(res);
					}
				}
				if(this.userDataArr.nationality_map){
                    var res1 = this.userDataArr.nationality_map.replace(/&quot;/g,'"');
					if(res1) {
						 this.nationalitySelectedItems = JSON.parse(res1);
					}   
				}
               if(this.userDataArr.phoneNo) {
               	    let splitPhone = this.userDataArr.phoneNo.split(" ",3);
               	     this.countryCode = splitPhone[0];
               	     this.phoneNumber = splitPhone[1];
               }

              console.log('response',this.userDataArr);
              this.image_url = this.image_base_url+''+this.userDataArr.userId;
              this.boolUserImage = true;
			  this.updateProfileForm.patchValue({
				firstName: this.userDataArr.firstName,
				lastName: this.userDataArr.lastName,
				email: this.userDataArr.email,
				userName: sessionStorage.getItem('user_name'),
				dob: this.datePipe.transform(this.userDataArr.dob,"MM/dd/yyyy"),
				occuptation_tt:this.userDataArr.occuptation_tt,
			    wakeup_time:this.time,
				weekend_wakeup_time:this.weekend_time,
				outing_day:this.datePipe.transform(this.userDataArr.outing_day,"MM/dd/yyyy"),
				maximunPrice:this.maximumPrice,
				minimumPrice:this.minimumPrice,
				stay_date:this.userDataArr.stay_date,
				gender:this.userDataArr.gender,
				phoneNo: this.userDataArr.phoneNo,
				address: this.userDataArr.address,
				work_place:this.userDataArr.work_place,
				postalCode: this.userDataArr.postalCode,
				country: this.userDataArr.country,
				biography:this.userDataArr.biography,
				interestes:this.userDataArr.interestes,
				habits:this.userDataArr.habits,
				previousCity:this.userDataArr.previous_city,
				rentalDescription:this.userDataArr.rental_desc,
				image:[''],
				social_account:this.userDataArr.social_account,
			});
			this.email = this.userDataArr.email;
			
		},error=>{ 
			console.log("ERROR");
			console.log(error.error);
		});  
	}
	
	onSelectFile(event) {
		
		 let file = event.target.files[0];
         this.fileData = file.name;
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
			this.boolUrl = true;
			this.boolUserImage =false;
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
		const pattern = /[^A-Za-z0-9]+/;
		let inputChar = String.fromCharCode(event.charCode);
		// console.log(inputChar, e.charCode);
		if (!pattern.test(inputChar)) {
			this.messageDigit1 = 'Only digit and alpha characters allowed.';
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

    	 this.languageArrMap.push(item);
         this.languageArr.push(item['id']);
	     if(this.languageArr.length == 2){
	        	this.toastr.infoToastr('You can select only maximum two languages.');
	     }
    }
    OnLanguageDeSelect(item: any) {
    	 
    	 this.languageArrMap.splice(this.languageArrMap.indexOf(item),1);
         this.languageArr.splice(this.languageArr.indexOf(item['id']),1);
     }

    onNationalitySelect(item:any){
	    this.nationalityArrMap.push(item);
	    this.nationalityArr.push(item['id']);
	      if(this.nationalityArr.length == 2){
	        	this.toastr.infoToastr('You can select only maximum two nationalities.');
	      }
    }
    OnNationalityDeSelect(item: any) {
    	
    	this.nationalityArrMap.splice(this.nationalityArrMap.indexOf(item),1);
        this.nationalityArr.splice(this.nationalityArr.indexOf(item['id']),1);
    }

	updateProfile(formValue) {
		
		if(formValue.stay_date == ""){
			this.stayDateEmpty = true;
		}
		if(formValue.languages  == ""){
			this.languageEmpty = true;
		}
		if(formValue.nationality == ""){
			this.nationalityEmpty = true;
		}
		if(formValue.country == ""){
			this.countryEmpty = true;
		}

	
		if(formValue.wakeup_time){
			this.wakeup_time = formValue.wakeup_time.hour+":"+formValue.wakeup_time.minute;
		}
	    if(formValue.weekend_wakeup_time){
			this.weekend_wakeup_time = formValue.weekend_wakeup_time.hour+":"+formValue.weekend_wakeup_time.minute;
		}
        
		if(parseInt(formValue.maximunPrice) < parseInt(formValue.minimumPrice)) {
			this.updateProfileForm.controls['minimumPrice'].reset()
            this.toastr.errorToastr('Maximum value must be greater than minimum value.');
		} 
		
		this.submitted = true;
		if(this.updateProfileForm.invalid) {
			return;
        
		} else {
               
			const formData = new FormData();
			formData.append('firstName', formValue.firstName);
			formData.append('lastName', formValue.lastName);
			formData.append('email', formValue.email);	 	   
			formData.append('photo', this.fileData);
			formData.append('phoneNo', formValue.phoneNo);
			formData.append('postal_code', formValue.postalCode);   
			formData.append('country', formValue.country);
			formData.append('address', formValue.address); 
			formData.append('biography', formValue.biography); 
			formData.append('dob', this.datePipe.transform(formValue.dob,"yyyy-MM-dd")); 
			formData.append('gender', formValue.gender); 
			formData.append('habits', formValue.habits); 
			formData.append('interestes', formValue.interestes); 
			formData.append('languages', this.languageArr); 
			formData.append('nationality',this.nationalityArr); 
            formData.append('languages_map', JSON.stringify(formValue.languages)); 
			formData.append('nationality_map',JSON.stringify(formValue.nationality));
			formData.append('occuptation_tt', formValue.occuptation_tt); 
			formData.append('outing_day', this.datePipe.transform(formValue.outing_day,"yyyy-MM-dd")); 
			formData.append('price_range', formValue.maximunPrice+'-'+formValue.minimumPrice); 
			formData.append('stay_date', formValue.stay_date); 
			formData.append('wakeup_time', this.wakeup_time);
			formData.append('wakeup_time', this.weekend_wakeup_time); 			
			formData.append('work_place', formValue.work_place); 
			formData.append('previous_city', formValue.previousCity); 
			formData.append('rental_desc', formValue.rentalDescription); 
			formData.append('social_account', formValue.social_account);

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
				this.router.navigate(['/my-account']);

			},error =>{
				this.isError = true;
				console.log('errors',error); 
				this.toastr.errorToastr(error.error.status,'Error');
				this.errorsArr = error.error;

			});
		}
	}

	
}
