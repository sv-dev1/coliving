import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup,FormBuilder,Validators,FormControl,FormArray } from '@angular/forms';
import { DataService } from '../../data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';
import {GooglePlaceDirective} from "../../ngx-google-places-autocomplete.directive";
import {ComponentRestrictions} from "../../objects/options/componentRestrictions";
import {Address} from "../../objects/address";
import {AddressComponent} from "../../objects/addressComponent";

@Component({
	selector: 'app-property',
	templateUrl: './property.component.html',
	styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

	addPropertyForm : FormGroup;
	teamForm : FormGroup;
	allPropertyArray : any =[];
	allProperties : any =[];
	isError : boolean = false;
	errorsArr : string = '';
	isopenAddPropertyModal : boolean = false;
	propertyForm : FormGroup;
	updatePropertyForm : FormGroup;
	submitted : boolean=false;
	url : any  = []; 
	fileData : any;
	p : any;
	base_url : string = '';
	image_base_url: string = '';
	isArrayLength : boolean = false;
	ispropertyInfo : boolean = false;
	propertyInfo : any = [];
	isopenSendCVModal : boolean = false;
	openTeam : boolean = false;
	allteam : any = [];
	allteamLength : any 
	prop_id : any;
	roleId : any;
	tenant : boolean = false;
	landLord : boolean = false;
	propertyLength : boolean = false;
	validationError : string = '';
	isValidationError: boolean = false;
	propertyEdit: any;
	isopenEditPropertyModal: boolean = false;
	boolpropertyImage : boolean = false;
	image_url : any;
	postedBy:  string = '';
	isInvite : boolean = false;
	allTeams: any = [];
	teamArrLength :  any = [];
	allTeamsLength :  any = [];
	isTeamLength :  boolean = false;
	propertyName : string = '';
	propertyId : string = '';
	isSuccess : boolean = false;
	success : string = '';
	inviteStatus :  any = [];
	teamCount : any ;
	error : any;
	disabled : boolean = false;
	isDisabled : boolean = false;
	response : any;
	isDelproperty : boolean = false;
    
	constructor(
		private formBuilder:FormBuilder,
		private router: Router,
		public toastr: ToastrManager,
		private data_service : DataService,
		private http : HttpClient,
		) { 
		this.addPropertyForm = this.formBuilder.group({
			name: ['', Validators.required],
			city: ['', Validators.required],
			property_type: ['', Validators.required],
			floor_space: ['', Validators.required],
			no_of_balconies: ['', Validators.required],
			no_of_bedrooms: ['', Validators.required],
			no_of_bathrooms: ['', Validators.required],
			no_of_garages: ['', Validators.required],
			no_of_parking_space: ['', Validators.required],
			pets_allowed: ['', Validators.required],
			status: ['', Validators.required],
			property_desc: ['', Validators.required],
			image: ['', Validators.required],	 
		});

		this.updatePropertyForm = this.formBuilder.group({
			name: ['', Validators.required],
			city: ['', Validators.required],
			property_type: ['', Validators.required],
			floor_space: ['', Validators.required],
			no_of_balconies: ['', Validators.required],
			no_of_bedrooms: ['', Validators.required],
			no_of_bathrooms: ['', Validators.required],
			no_of_garages: ['', Validators.required],
			no_of_parking_space: ['', Validators.required],
			pets_allowed: ['', Validators.required],
			status: ['', Validators.required],
			property_desc: ['', Validators.required],
			image: ['', Validators.required],	 
		});

		this.image_base_url = environment.image_base_url;
		this.base_url = environment.base_url;
		this.teamForm = this.formBuilder.group({
			team_id: ['', Validators.required],
			gchat: ['', Validators.required],
			landlord_id: ['', Validators.required],
			property_id: ['', Validators.required],
			agree: ['', Validators.required],
		}); 
        this.getAllProperties();

	}

	ngOnInit() {
		this.getAllProperties();	 
		this.roleId = sessionStorage.getItem("roleId");
		if(this.roleId == 4){
			this.tenant=true;
		}
		if(this.roleId == 3){
			this.landLord=true;
		}
		if(sessionStorage.getItem("roleId") != '3'){
  		        this.router.navigate(['/']);
        }
	}

	getAllProperties() {
		this.data_service.getProperties().subscribe((response:any) =>{   
			this.allProperties = response.flats;
			this.propertyLength = this.allProperties.length;
			/*console.log('this.propertyLength', this.allProperties);*/
			if(this.allProperties.length  > 9 ) {
				this.isArrayLength  = true;
			}
			this.isError = false;    
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		});
	}
	openAddPropertyModal(){
		this.isopenAddPropertyModal = true;
	}
	closeModal(){
		this.isopenAddPropertyModal = false;
		this.submitted = false;   
		this.isValidationError = false;  
		this.addPropertyForm.reset();

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
			this.boolpropertyImage = false;
		}
	}
	get f() { return this.addPropertyForm.controls; }
	get tF() { return this.teamForm.controls; }

	addProperty() {
		this.disabled = true;
        this.isError =  false; 
		this.submitted = true;
		if(this.addPropertyForm.invalid) {
			this.disabled = false;
			this.isValidationError = true;
			return;
		}else{
			const input_data = {  
				"name": this.addPropertyForm.value.name, 
				"city": this.addPropertyForm.value.city, 
				"floor_space": this.addPropertyForm.value.floor_space, 
				"no_of_balconies": this.addPropertyForm.value.no_of_balconies, 
				"no_of_bathrooms": this.addPropertyForm.value.no_of_bathrooms, 
				"no_of_bedrooms": this.addPropertyForm.value.no_of_bedrooms, 
				"no_of_garages": this.addPropertyForm.value.no_of_garages, 
				"no_of_parking_space": this.addPropertyForm.value.no_of_parking_space, 
				"pets_allowed": this.addPropertyForm.value.pets_allowed, 
				"property_desc": this.addPropertyForm.value.property_desc, 
				"property_type": this.addPropertyForm.value.property_type, 
				"status": this.addPropertyForm.value.status         
			}
			const formData = new FormData();
			formData.append('name', input_data.name);
			formData.append('city', input_data.city);
			formData.append('floor_space', input_data.floor_space);
			formData.append('files', this.fileData);	  
			formData.append('no_of_balconies', input_data.no_of_balconies);
			formData.append('no_of_bathrooms', input_data.no_of_bathrooms);
			formData.append('no_of_bedrooms', input_data.no_of_bedrooms);
			formData.append('no_of_garages', input_data.no_of_garages);
			formData.append('no_of_parking_space', input_data.no_of_parking_space);
			formData.append('pets_allowed', input_data.pets_allowed);
			formData.append('property_desc', input_data.property_desc);
			formData.append('property_type', input_data.property_type);
			formData.append('status', input_data.status);
			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'propertynew', formData, httpOptions).subscribe((response:any) => {
				this.toastr.successToastr(response.message, 'Success!');
				this.isopenAddPropertyModal = false;
				this.submitted = false;
				this.addPropertyForm.reset(); 
				this.url = '';
				this.getAllProperties();
				this.disabled = false;
			},error=>{ 
				this.disabled = false;
				if(error.error.name=='SequelizeUniqueConstraintError') {
					this.isError =  true; 
				    this.error = 'Property already exist.';
					//this.toastr.errorToastr(error.error.name, 'Error!');
				}
			});
		}
	}

	viewFullDetail(property){
		this.ispropertyInfo = true;
		this.propertyInfo = property;
	}
	closeInfoModal() {
		this.ispropertyInfo = false;  
		this.openTeam = false;
	}
	sendCV(property){
		this.prop_id = property.propertyId;
		this.openTeam = true;
		this.data_service.getTeam().subscribe((response: any) =>{
			this.allteam = response.teams;
			this.allteamLength = this.allteam.length;
			// console.log(this.allteam);
		})
	}

	sendCVModal(property) {
		this.isopenSendCVModal = true;
		this.propertyInfo = property;
		this.submitted=true;
		if(this.teamForm.invalid){
			return;
		}
		this.openTeam = false;
		this.teamForm.reset();
	}
	closeCvModal() {
		this.isopenSendCVModal = false;
	}
	teamFormSubmit(){
		this.submitted = true;
		if(this.teamForm.invalid){
			return;
		}
		this.openTeam = false;
		this.teamForm.reset();
	}

	editPropertyModal(property){
		
		this.propertyEdit = property.propertyId;
		this.isopenEditPropertyModal = true;
		this.boolpropertyImage  = true;
		this.image_url = this.image_base_url+''+property.propertyId;
		this.updatePropertyForm.patchValue({
			name: property.name,
			city: property.city,
			property_type: property.property_type,
			floor_space: property.floor_space,
			no_of_balconies: property.no_of_bathrooms,
			no_of_bedrooms: property.no_of_bedrooms,
			no_of_bathrooms: property.no_of_bathrooms,
			no_of_garages: property.no_of_garages,
			no_of_parking_space: property.no_of_parking_space,
			pets_allowed: property.pets_allowed,
			status: property.status,
			property_desc: property.property_desc,
			image:[''],  
		});
	}

	closeEditModal() {
		this.isopenEditPropertyModal = false;
		this.updatePropertyForm.reset();
	}

	get g() { return this.updatePropertyForm.controls; }

	updateProperty(formValue) {
        this.disabled = true;
		this.submitted = true;
		if(this.updatePropertyForm.invalid) {
			this.disabled = false;
			return;
		}else{
			const input_data = {  
				"property_id": this.propertyEdit,
				"name": formValue.name, 
				"property_desc": formValue.property_desc,   
				"city": formValue.city,
				"property_type": formValue.property_type,
				"floor_space": formValue.floor_space,
				"no_of_balconies": formValue.no_of_balconies,
				"no_of_bedrooms": formValue.no_of_bedrooms,
				"no_of_kitchens": formValue.no_of_kitchens,
				"no_of_bathrooms": formValue.no_of_bathrooms,
				"no_of_garages": formValue.no_of_garages,
				"no_of_parking_space": formValue.no_of_parking_space,
				"pets_allowed": formValue.pets_allowed,
				"status": formValue.status
			}
			
			const formData = new FormData();
			formData.append('name', input_data.name);
			formData.append('city', input_data.city);
			formData.append('floor_space', input_data.floor_space);
			formData.append('files', this.fileData);		  
			formData.append('no_of_balconies', input_data.no_of_balconies);
			formData.append('no_of_bathrooms', input_data.no_of_bathrooms);
			formData.append('no_of_bedrooms', input_data.no_of_bedrooms);
			formData.append('no_of_garages', input_data.no_of_garages);
			formData.append('no_of_parking_space', input_data.no_of_parking_space);
			formData.append('pets_allowed', input_data.pets_allowed);
			formData.append('property_desc', input_data.property_desc);
			formData.append('property_type', input_data.property_type);
			formData.append('status', input_data.status);
			let token; 
			if(sessionStorage.getItem("auth_token")!=undefined){
				token = sessionStorage.getItem("auth_token"); 
			}
			const httpOptions = { headers: new HttpHeaders({'authorization': token })};
			this.http.post(this.base_url+'property/edit/'+input_data.property_id, formData, httpOptions).subscribe((response:any) => {
				this.toastr.successToastr(response.message, 'Success!');
				this.isopenEditPropertyModal = false;
				this.submitted = false;
				this.updatePropertyForm.reset(); 
				this.url = '';
				this.getAllProperties();
				this.disabled = false;
			},error=>{ 
				 this.isDisabled  = false;
				 if(error.error.name=='SequelizeUniqueConstraintError') {
					this.isError =  true; 
				    this.error = error.error.name;
					//this.toastr.errorToastr(error.error.name, 'Error!');
				  }
			  });
		}
	}	

	sendInvitation (property) {
			this.propertyId = property.propertyId;
			this.propertyName = property.name
			this.data_service.getTeamForLandlord(this.propertyId).subscribe((response:any) =>{   
			this.allTeams = response.teams;
			/*console.log('this.allTeams', this.allTeams);*/
			this.teamCount = this.allTeams.length;
	        if(this.teamCount  > 0 ) {
				this.getPropertyInvites(this.propertyId);
			}
	        if(this.allTeamsLength.length  > 9 ) {
				this.isTeamLength  = true;
			}
			this.isError = false;    
			this.isInvite = true;
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}
	getPropertyInvites (property) {
			this.data_service.getPropertyInvites(property).subscribe((response:any) =>{   
			this.isError = false;    
			this.isInvite = true;
		}, error =>{ 
			this.isError = true; 
			this.errorsArr = error.error;
		})
	}

	closeInviteModal() {
		this.isInvite = false;
		this.isSuccess =  false; 
	    this.success = '';
	}

	changed(event){		
		if(event) {
			this.isSuccess =  false; 
			const formData = {
				"property_id": this.propertyId,
				"team_id": event,
				"userId": sessionStorage.getItem("userId")
			}
			let property = {'propertyId': this.propertyId};
			this.data_service.sendInvite(formData).subscribe((response:any)=> { 
			    this.inviteStatus =  response.requestData
				this.isSuccess =  true; 
				this.success = response.message;
				this.sendInvitation(property);
			},error =>{
				this.isError = true; 
				this.errorsArr = error.error;
			});
		}
	}
    
    deleteCategoryModal(property) {
    	
    	this.propertyName = property.name;
		this.propertyId = property.propertyId;
    	this.isDelproperty = true;
    }
    closeDelModal(){
		this.toastr.infoToastr('All information associated to the property '+this.propertyName+' are safe.');
		this.isDelproperty = false;
	}

	deleteProperty(propertyId) {
        if(propertyId) {
	           	this.data_service.deleteProperty(propertyId).subscribe((response:any) =>{
		        this.response = JSON.stringify(response, undefined, 2); 
		        this.isDelproperty = false;
	            this.getAllProperties();
		        this.toastr.successToastr(response.message,'Success');
		        this.router.navigate(['/properties']);  
		        this.isError = false;
		      }, error =>{ 
		        this.isError = true; 
		      //this.toastr.errorToastr('Invalid Credentials','Error');
		      })
        } else {
           this.toastr.errorToastr('Technical issue occured','warning');
        }
	}
}


 

