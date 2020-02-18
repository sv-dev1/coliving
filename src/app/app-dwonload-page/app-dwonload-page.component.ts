import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import { first } from 'rxjs/operators';

@Component({
	selector: 'app-app-dwonload-page',
	templateUrl: './app-dwonload-page.component.html',
	styleUrls: ['./app-dwonload-page.component.css']
})
export class AppDwonloadPageComponent implements OnInit {

	questionareform:FormGroup;
	isEmailModal :boolean = false;
	submitted : boolean = false; 
	isError : boolean = false;
	isSuccess : boolean = false;
	errorsArr:any = []; 
	referralCode : any;
	downloadUrl : string = '';
	openFileDownloadModal: boolean = false;
    image_base_url : any;
	image_url : any;
	base_url : any;
	fileData : any;
	userDataArr : any;
	email : any;
	messageDigit : string = '';
	messageDigit1 : string = '';
	time = {hour: 8, minute: 30};
	weekend_wakeup_time = {hour: 8, minute: 30};
	today : any;
	teamEmpty : boolean=false;
	userEmpty : boolean=false;
	allCountriesArray : any = [];
	allCountries : any = [];
	allLanguagesArray :  any = [];
	allLanguages : any = [];
	countrydropdownList : any = [];
	langdropdownList : any  = [];
	dropdownSettingsCountry  =  {}
	dropdownSettingsLanguage =  {}
	nationalityArr : any = [];
	languageArr : any=[];
	atmostTwoValNat : boolean = false;
	atmostTwoValLang : boolean = false;
	countryEmpty : boolean = false;
	languageEmpty : boolean = false;
	nationalityEmpty : boolean = false;
	stayDateEmpty : boolean = false;
	stay_date : any;
	weekend_time : any;
	Dtime : any;
	length : boolean = false;
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
    url : any = '';
    isthankyouMessage : boolean = false;
    thankyouMessage : string = '';
    removeValidation : boolean = false;
    imageEmpty : boolean = false;

	constructor(
		    private formBuilder:FormBuilder,
			private router: Router,
			public toastr: ToastrManager,
			private data_service : DataService,
			private http : HttpClient,
			calendar: NgbCalendar,
			private datePipe: DatePipe,
			private route: ActivatedRoute
		) { 
		this.questionareform = this.formBuilder.group({

			firstName: ['', Validators.required],
			favouriteLocation: ['', Validators.required],
			dob: ['', Validators.required],
			weekend_wakeup_time: [{hour: 8, minute: 30}, Validators.required],
			languages: ['', Validators.required],
			nationality: ['', Validators.required],
			gender: ['', Validators.required],
			phoneNo: ['', Validators.required],
			occuptation_tt: ['', Validators.required],
			maximunPrice: ['', Validators.required],
			minimumPrice: ['', Validators.required],
			image: [''],
			stay_date: [''],
			biography: ['', Validators.required],
			interestes: ['', Validators.required],
            outing_day: ['', Validators.required],
			partying: ['', Validators.required],
			alcohol: ['', Validators.required],
			smoking: ['', Validators.required],
			apartment_clean_importance: ['', Validators.required],
			apartment_party: ['', Validators.required],
			music: ['', Validators.required],
			email: ['', Validators.required],
			social_account: [''],
			ref_code: ['', Validators.required],
			agree: ['false', Validators.requiredTrue],
		});
		this.today = new Date();
		this.base_url = environment.base_url;
		this.image_base_url = environment.image_base_url;
	}

	ngOnInit() {
		this.getAllCountries();
		this.getAllLanguages();
		this.getCurrentIP();
		const referralCode: string = this.route.snapshot.queryParamMap.get('rc');
		console.log(referralCode);
		if(referralCode) {
			this.questionareform.patchValue({
				ref_code : referralCode,
			});  
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
  
	onSelectFile(event) {
       // console.log(event);
		this.fileData = event.target.files[0];
		if(this.fileData != '' || this.fileData != undefined || this.fileData != null) {
			this.imageEmpty = false;
		}
		this.preview();
		this.questionareform.patchValue({
			'image' :  this.fileData
		});
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

	openEmailModal() {
		this.isEmailModal = true;
	}

    checkLength(length){
    	console.log('check length',length);
    }

    onLanguageSelect(item:any){

         this.languageEmpty = false;
    	 this.languageArrMap.push(item);
         this.languageArr.push(item['id']);
	     if(this.languageArr.length == 2){
	        	this.toastr.infoToastr('You can select only maximum two languages.');
	     }
    }

    OnLanguageDeSelect(item: any) {

    	 
    	 this.languageArrMap.splice(this.languageArrMap.indexOf(item),1);
         this.languageArr.splice(this.languageArr.indexOf(item['id']),1);
         
         if(this.languageArr.length == 0) {
         	this.languageEmpty = true;
         }
     } 

    onNationalitySelect(item:any){
    	this.nationalityEmpty = false;
	    this.nationalityArrMap.push(item);
	    this.nationalityArr.push(item['id']);
	      if(this.nationalityArr.length == 2){
	        	this.toastr.infoToastr('You can select only maximum two nationalities.');
	      }
    }

    OnNationalityDeSelect(item: any) {
    	
    	this.nationalityArrMap.splice(this.nationalityArrMap.indexOf(item),1);
        this.nationalityArr.splice(this.nationalityArr.indexOf(item['id']),1);
         if(this.nationalityArr.length == 0) {
         	this.nationalityEmpty = true;
         }
    }

	get f() { return this.questionareform.controls; }
	
	questionareSubmit(formValue){
       console.log('formvalue kkk----', this.questionareform.controls);
       console.log('formvalue----', this.questionareform.status);
      
		this.submitted = true;
	    if(this.questionareform.status == undefined) {
        	this.toastr.errorToastr('We are unable to process the request.Please check the form something might be not filled properly.');
            return;
        }
		if(formValue.languages  == ""){
			this.languageEmpty = true;
		}
		if(formValue.image  == ""){
			this.imageEmpty = true;
		}
		
		if(formValue.nationality == ""){
			this.nationalityEmpty = true;
		}
		if(formValue.country == ""){
			this.countryEmpty = true;
		}

	    if(formValue.weekend_wakeup_time){
			this.weekend_time = formValue.weekend_wakeup_time.hour+":"+formValue.weekend_wakeup_time.minute;
		}
        
		if(parseInt(formValue.maximunPrice) < parseInt(formValue.minimumPrice)) {
			//console.log('stuck here---price?');
            this.toastr.errorToastr('Maximum value must be greater than minimum value.');
            return;
		}
		if(this.questionareform.value['ref_code'] == undefined || this.questionareform.value['ref_code'] ==null) {
			//console.log('stuck here---refcode?');
			this.toastr.errorToastr('Missing referral code.', 'Error!');
			this.router.navigate(['/login']); 
			return;
		}
		if(this.questionareform.value['phoneNo'] != '' )
            if(this.questionareform.controls.phoneNo.status == 'INVALID'){
			  this.toastr.errorToastr('Please enter your valid phone number.');
              return;
		}
		   
		if(this.questionareform.invalid) {
			return;
		} else{
		    let price_range=  formValue.minimumPrice+'-'+formValue.maximunPrice; 
           /* console.log('price_range-------',price_range);
		    console.log('step second-------',formValue);
		    return;*/
		    const formData = new FormData();
			formData.append('firstName', formValue.firstName);
			formData.append('favourite_location', formValue.favouriteLocation);
			formData.append('photo', this.fileData);
			formData.append('phoneNo', formValue.phoneNo);
			formData.append('biography', formValue.biography); 
			formData.append('dob', this.datePipe.transform(formValue.dob,"yyyy-MM-dd")); 
			formData.append('gender', formValue.gender); 
			formData.append('interestes', formValue.interestes); 
			formData.append('languages', this.languageArr); 
			formData.append('nationality',this.nationalityArr); 
            formData.append('languages_map', JSON.stringify(formValue.languages)); 
			formData.append('nationality_map',JSON.stringify(formValue.nationality));
			formData.append('occuptation_tt', formValue.occuptation_tt); 
			formData.append('outing_day', this.datePipe.transform(formValue.outing_day,"yyyy-MM-dd")); 
			formData.append('price_range', price_range); 
			formData.append('stay_date', formValue.stay_date);
			formData.append('wakeup_time', this.weekend_time); 
			formData.append('email', formValue.email);
			formData.append('social_account', formValue.social_account);
			formData.append('alcohol', formValue.alcohol);
			formData.append('partying', formValue.partying);			
		    formData.append('smoking', formValue.smoking);
			formData.append('apartment_clean_importance', formValue.apartment_clean_importance);
			formData.append('apartment_party', formValue.apartment_party);
			formData.append('music', formValue.music);
			formData.append('ref_code', formValue.ref_code);

			let token; 
            if(sessionStorage.getItem("auth_token")!=undefined){
            token = sessionStorage.getItem("auth_token"); 
            }
            const httpOptions = { headers: new HttpHeaders({'authorization': token })};
            this.http.post(this.base_url+'apiRegister', formData).subscribe((response:any) => {
				
                console.log('response', response);
               
				if(response.error ==true) {
					this.toastr.errorToastr(response.message, 'Error');
				} else if(response.profile) {
					this.toastr.successToastr(response.message, 'Success!');
					this.submitted = false;
					this.questionareform.reset();
					this.openFileDownloadModal = true;
				}
			},error =>{
				this.isError = true;
				console.log('errors',error); 
				this.toastr.errorToastr(error.error.status,'Error');
				this.errorsArr = error.error;

			});
		}
	}
	closeModal() {
		this.isthankyouMessage = true;
	    this.thankyouMessage = 'Thank you for downloading the app.';
		
	} 

	
}


