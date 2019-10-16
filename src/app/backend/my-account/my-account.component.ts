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
	Dtime:any;
	priceSplit:any;
	finalData:any;
	ip_address : string = "";
	current_country : string = "";
	nationalitySelectedItems = [];
	languageSelectedItems = [];
	languageArrMap : any = [];
	nationalityArrMap : any = [];

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
			previous_city:['']
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
		    if(this.userDataArr.stay_date == null){
				this.userDataArr.stay_date=""	
			}
			else if(this.userDataArr.stay_date != 'Invalid date'){
				let str = this.userDataArr.stay_date; 
				let splitted = str.split(" - ", 2); 
				 this.finalData = this.datePipe.transform(splitted[0],"MM/dd/yyyy")+" - "+this.datePipe.transform(splitted[1],"MM/dd/yyyy");
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
			    }
			else {
				   this.time = this.time;
			}
			if(this.userDataArr.price_range){
				this.priceSplit = this.userDataArr.price_range.split("-", 2); 
			}

			this.image_url = this.image_base_url+''+this.userDataArr.userId;
			this.updateProfileForm= this.formBuilder.group({
				firstName: this.userDataArr.firstName,
				lastName: this.userDataArr.lastName,
				email: this.userDataArr.email,
				userName: sessionStorage.getItem('user_name'),
				dob:this.datePipe.transform(this.userDataArr.dob,"MM/dd/yyyy"),
				occuptation_tt:this.userDataArr.occuptation_tt,
				wakeup_time:this.time,
				outing_day:this.datePipe.transform(this.userDataArr.outing_day,"MM/dd/yyyy"),
				maximunPrice:this.priceSplit[1],
				minimumPrice:this.priceSplit[0],
				languages:[''],
				nationality:[''],
				stay_date:this.finalData,
				gender:this.userDataArr.gender,
				phoneNo: this.userDataArr.phoneNo,
				address: this.userDataArr.address,
				work_place:this.userDataArr.work_place,
				postalCode: this.userDataArr.postalCode,
				country: this.userDataArr.country,
				
				biography:this.userDataArr.biography,
				interestes:this.userDataArr.interestes,
				habits:this.userDataArr.habits,
				previous_city:this.userDataArr.previous_city,
				image:['']

			});
			this.email = this.userDataArr.email;
			console.log(this.userDataArr);
			this.fileData=this.image_url;
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
	   if(this.updateProfileForm.value['stay_date']){
				this.updateProfileForm.value['stay_date']=this.updateProfileForm.value['stay_date'][0]+" - "+this.updateProfileForm.value['stay_date'][1];
		}
		if(this.updateProfileForm.value['wakeup_time']){
			this.updateProfileForm.value['wakeup_time']=this.updateProfileForm.value['wakeup_time'].hour+":"+this.updateProfileForm.value['wakeup_time'].minute;
		} 
		this.submitted = true;  
		let dataObj=this.updateProfileForm.value;
		let priceRange=  dataObj.minimumPrice+"-"+dataObj.maximunPrice;
		if(dataObj.stay_date != "01/01/1970 - 01/01/1970"){
          this.finalData=dataObj.stay_date;
		}
		 if(this.nationalityArr.length > '2'){
			   this.atmostTwoValNat = true;
		  }
		 if(this.languageArr.length > '2'){
			   this.atmostTwoValLang = true;
		 }
		const formData = new FormData();
			formData.append('firstName', dataObj.firstName);
			formData.append('lastName', dataObj.lastName);
			formData.append('email', dataObj.email);	 	   
			formData.append('upload_photo', this.fileData);
			formData.append('phoneNo', dataObj.phoneNo);
			formData.append('postalCode', dataObj.postalCode);   
			formData.append('country', dataObj.country);
			formData.append('address', dataObj.address); 
			formData.append('biography', dataObj.biography); 
			formData.append('dob', dataObj.dob); 
			formData.append('gender', dataObj.gender); 
			formData.append('habits', dataObj.habits); 
			formData.append('interestes', dataObj.interestes); 
			formData.append('languages', this.languageArr); 
			formData.append('nationality',this.nationalityArr); 
			formData.append('occuptation_tt', dataObj.occuptation_tt); 
			formData.append('outing_day', dataObj.outing_day); 
			formData.append('price_range', priceRange); 
			formData.append('stay_date', this.finalData); 
			formData.append('wakeup_time', dataObj.wakeup_time); 
			formData.append('work_place', dataObj.work_place); 
			formData.append('previous_city', dataObj.previous_city); 
			
			 if(this.updateProfileForm.invalid){
						console.log("invalid");
			 }
			 else{
				let token; 
				if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
				}
				const httpOptions = { headers: new HttpHeaders({'authorization': token })};
				this.http.put(this.base_url+'user/profile', formData, httpOptions).subscribe((response:any) => {
					console.log('response', response);
					this.toastr.successToastr(response.message,'Success');
					this.submitted = false;
					this.atmostTwoValNat = false;
					this.atmostTwoValLang = false;

					this.getUserData();

				},error =>{
					this.isError = true;
					console.log('errors',error); 
					this.errorsArr = error.error;

				});
			 }
		
	}

	onLanguageSelect(item:any){
		this.languageArrMap.push(item['id']+'-'+item['itemName']);
		this.languageArr.push(item['itemName']);
		if(this.languageArr.length == 2){
			   this.toastr.infoToastr('You can select only maximum two languages.');
		}
   }
   OnLanguageDeSelect(itemde: any) {
		this.languageArrMap.splice(this.languageArrMap.indexOf(itemde['id']+'-'+itemde['itemName']),1);
		this.languageArr.splice(this.languageArr.indexOf(itemde['itemName']),1);
	}

   onNationalitySelect(itemla:any){
	   this.nationalityArrMap.push(itemla['id']+'-'+itemla['itemName']);
	   this.nationalityArr.push(itemla['itemName']);
		 if(this.nationalityArr.length == 2){
			   this.toastr.infoToastr('You can select only maximum two nationalities.');
		 }
   }
   OnNationalityDeSelect(itemlade: any) {
	this.nationalityArrMap.splice(this.nationalityArrMap.indexOf(itemlade['id']+'-'+itemlade['itemName']),1);
	this.nationalityArr.splice(this.nationalityArr.indexOf(itemlade['itemName']),1);
  }
	
}